require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET;
const AES_SECRET = process.env.AES_SECRET;
const CAPABILITY_CODE = process.env.CAPABILITY_CODE || "SECURE-CODE-ADV-2026";

const db = new sqlite3.Database(path.join(__dirname, "db.sqlite"));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      encrypted_password TEXT,
      role TEXT,
      created_at TEXT
    );`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS security_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT,
      details TEXT,
      created_at TEXT
    );`
  );
});

function encryptPassword(plainTextPassword) {
  return CryptoJS.AES.encrypt(plainTextPassword, AES_SECRET).toString();
}

function decryptPassword(encryptedPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, AES_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function logSecurityEvent(eventType, detailsObj) {
  const stmt = db.prepare(
    "INSERT INTO security_logs (event_type, details, created_at) VALUES (?, ?, ?)"
  );
  stmt.run(eventType, JSON.stringify(detailsObj), new Date().toISOString());
  stmt.finalize();
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing JWT token."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
}

function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Role information missing."
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions for this operation."
      });
    }

    next();
  };
}

app.post("/api/signup", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required."
    });
  }

  const encryptedPassword = encryptPassword(password);

  const stmt = db.prepare(
    "INSERT INTO users (username, encrypted_password, role, created_at) VALUES (?, ?, ?, ?)"
  );

  stmt.run(
    username,
    encryptedPassword,
    role || "user",
    new Date().toISOString(),
    (err) => {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.json({
            success: false,
            message: "Username already exists."
          });
        }

        logSecurityEvent("signup_error", { username, error: err.message });

        return res.status(500).json({
          success: false,
          message: "Error inserting user."
        });
      }

      logSecurityEvent("signup_success", { username, role: role || "user" });

      res.json({
        success: true,
        message: "User created securely with encrypted credentials."
      });
    }
  );

  stmt.finalize();
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required."
    });
  }

  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");

  stmt.get(username, (err, user) => {
    if (err) {
      logSecurityEvent("login_error", { username, error: err.message });

      return res.status(500).json({
        success: false,
        message: "Error during login."
      });
    }

    if (!user) {
      logSecurityEvent("login_fail_user_not_found", { username });

      return res.json({
        success: false,
        message: "User not found."
      });
    }

    const decryptedPassword = decryptPassword(user.encrypted_password);

    if (decryptedPassword !== password) {
      logSecurityEvent("login_fail_wrong_password", { username });

      return res.json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "2h"
    });

    logSecurityEvent("login_success", { username, role: user.role });

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: tokenPayload
    });
  });

  stmt.finalize();
});

app.post(
  "/api/secure-query",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    const { capabilityCode, usernameFilter } = req.body;

    if (capabilityCode !== CAPABILITY_CODE) {
      logSecurityEvent("capability_code_fail", {
        username: req.user.username,
        provided: capabilityCode
      });

      return res.status(403).json({
        success: false,
        message: "Invalid capability code. Access denied."
      });
    }

    const safeFilter = usernameFilter || "";

    const stmt = db.prepare(
      "SELECT id, username, role, created_at FROM users WHERE username LIKE ?"
    );

    stmt.all("%" + safeFilter + "%", (err, rows) => {
      if (err) {
        logSecurityEvent("secure_query_error", {
          username: req.user.username,
          error: err.message
        });

        return res.status(500).json({
          success: false,
          message: "Error executing secure query."
        });
      }

      logSecurityEvent("secure_query_success", {
        username: req.user.username,
        filter: safeFilter,
        count: rows.length
      });

      res.json({
        success: true,
        message: "Secure query executed without SQL injection.",
        results: rows
      });
    });

    stmt.finalize();
  }
);

app.post("/api/unsafe-query", authMiddleware, (req, res) => {
  const { rawFilter } = req.body;

  const unsafeSql =
    "SELECT id, username, role, created_at FROM users WHERE username LIKE '%" +
    rawFilter +
    "%'";

  logSecurityEvent("unsafe_query_attempt", {
    username: req.user.username,
    rawFilter,
    unsafeSql
  });

  db.all(unsafeSql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message:
          "Unsafe query failed (this route demonstrates injection risk)."
      });
    }

    res.json({
      success: true,
      sql: unsafeSql,
      results: rows
    });
  });
});

app.get("/api/dashboard", authMiddleware, (req, res) => {
  db.get("SELECT COUNT(*) AS totalUsers FROM users", (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to load dashboard."
      });
    }

    db.get(
      "SELECT COUNT(*) AS totalLogs FROM security_logs",
      (logErr, logRow) => {
        if (logErr) {
          return res.status(500).json({
            success: false,
            message: "Failed to load logs count."
          });
        }

        res.json({
          success: true,
          totalUsers: row.totalUsers,
          totalLogs: logRow.totalLogs
        });
      }
    );
  });
});

app.get(
  "/api/security-logs",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    db.all(
      "SELECT id, event_type, details, created_at FROM security_logs ORDER BY created_at DESC LIMIT 50",
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Failed to load security logs."
          });
        }

        res.json({
          success: true,
          logs: rows
        });
      }
    );
  }
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Advanced secure SQL system running on http://localhost:${PORT}`);
});