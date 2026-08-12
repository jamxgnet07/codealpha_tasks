const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "database.json");

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function isFalsePositive(record) {
  if (!record.name || !record.email || !record.phone || !record.department) {
    return true;
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email);
  const phoneValid = /^[0-9]{10}$/.test(record.phone);

  return !emailValid || !phoneValid;
}

function findDuplicate(records, newRecord) {
  return records.find((record) => {
    return (
      normalizeValue(record.email) === normalizeValue(newRecord.email) ||
      normalizeValue(record.phone) === normalizeValue(newRecord.phone)
    );
  });
}

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({
      success: true,
      message: "Login successful"
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid admin credentials"
  });
});

app.post("/api/validate", (req, res) => {
  try {
    const { name, email, phone, department } = req.body;
    const newRecord = { name, email, phone, department };

    if (isFalsePositive(newRecord)) {
      return res.json({
        success: false,
        status: "False Positive",
        message: "Invalid or incomplete data. Record rejected."
      });
    }

    const records = readDatabase();
    const duplicate = findDuplicate(records, newRecord);

    if (duplicate) {
      return res.json({
        success: false,
        status: "Redundant",
        message: "Duplicate record found. Data not inserted.",
        duplicate
      });
    }

    const verifiedRecord = {
      id: uuidv4(),
      name: name.trim(),
      email: normalizeValue(email),
      phone: normalizeValue(phone),
      department: department.trim(),
      status: "Verified Unique",
      createdAt: new Date().toISOString()
    };

    records.push(verifiedRecord);
    writeDatabase(records);

    res.json({
      success: true,
      status: "Unique",
      message: "Unique verified data inserted successfully.",
      record: verifiedRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during validation."
    });
  }
});

app.get("/api/records", (req, res) => {
  try {
    const { search = "", status = "" } = req.query;
    let records = readDatabase();

    if (search) {
      const searchText = normalizeValue(search);
      records = records.filter((record) =>
        normalizeValue(record.name).includes(searchText) ||
        normalizeValue(record.email).includes(searchText) ||
        normalizeValue(record.phone).includes(searchText) ||
        normalizeValue(record.department).includes(searchText)
      );
    }

    if (status) {
      records = records.filter((record) => record.status === status);
    }

    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      total: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch records."
    });
  }
});

app.get("/api/dashboard", (req, res) => {
  try {
    const records = readDatabase();

    const totalRecords = records.length;
    const verifiedRecords = records.filter(
      (record) => record.status === "Verified Unique"
    ).length;

    res.json({
      success: true,
      totalRecords,
      verifiedRecords,
      redundantBlocked: "Handled during validation",
      falsePositiveBlocked: "Handled during validation"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Dashboard loading failed."
    });
  }
});

app.get("/api/export/csv", (req, res) => {
  try {
    const records = readDatabase();
    let csv = "Name,Email,Phone,Department,Status,CreatedAt\n";

    records.forEach((record) => {
      csv += `"${record.name}","${record.email}","${record.phone}","${record.department}","${record.status}","${record.createdAt}"\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("records.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).send("CSV export failed.");
  }
});

app.delete("/api/records/:id", (req, res) => {
  try {
    const records = readDatabase();
    const filteredRecords = records.filter((record) => record.id !== req.params.id);
    writeDatabase(filteredRecords);

    res.json({
      success: true,
      message: "Record deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed."
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});