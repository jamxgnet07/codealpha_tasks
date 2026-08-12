const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const BOOKINGS_FILE = path.join(__dirname, "bookings.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readBookings() {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
}

function saveBookings(bookings) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

function calculateFare(from, to, passengers, passType) {
  const routePrices = {
    "Chennai-Tambaram": 25,
    "Chennai-Chengalpattu": 50,
    "Chennai-Kanchipuram": 70,
    "Tambaram-Chengalpattu": 30,
    "Tambaram-Kanchipuram": 45,
    "Chengalpattu-Kanchipuram": 20
  };

  const directKey = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;

  let baseFare = routePrices[directKey] || routePrices[reverseKey] || 40;

  if (passType === "Daily Pass") baseFare += 10;
  if (passType === "Weekly Pass") baseFare += 50;
  if (passType === "Monthly Pass") baseFare += 200;

  return baseFare * Number(passengers);
}

app.post("/api/book", (req, res) => {
  try {
    const { name, email, from, to, passengers, passType, journeyDate } = req.body;

    if (!name || !email || !from || !to || !passengers || !passType || !journeyDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    if (from === to) {
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be the same."
      });
    }

    const fare = calculateFare(from, to, passengers, passType);

    const newBooking = {
      id: uuidv4(),
      ticketNumber: "BUS-" + Date.now(),
      name,
      email,
      from,
      to,
      passengers: Number(passengers),
      passType,
      journeyDate,
      fare,
      bookingTime: new Date().toISOString(),
      status: "Confirmed"
    };

    const bookings = readBookings();
    bookings.push(newBooking);
    saveBookings(bookings);

    res.json({
      success: true,
      message: "Ticket booked successfully.",
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while booking ticket."
    });
  }
});

app.get("/api/bookings", (req, res) => {
  try {
    const bookings = readBookings();
    res.json({
      success: true,
      total: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch bookings."
    });
  }
});

app.get("/api/ticket/:ticketNumber", (req, res) => {
  try {
    const bookings = readBookings();
    const ticket = bookings.find(
      (b) => b.ticketNumber === req.params.ticketNumber
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found."
      });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving ticket."
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});