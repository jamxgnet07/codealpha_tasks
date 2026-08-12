# CodeAlpha Task 3 – Cloud-Based Bus Pass System

## Overview

This project is a **Cloud-Based Bus Pass / Ticket Booking System**. It allows users to book bus tickets or passes online, automatically calculates fares based on routes and pass types, stores digital tickets, and provides a booking list for admin viewing.

## Features

- **Online ticket/pass booking interface**  
  - Web form to collect passenger name, email, source, destination, passengers count, pass type (Single/Daily/Weekly/Monthly), journey date.

- **Validation and data correctness**  
  - Ensures all fields are filled and source and destination are not the same.

- **Automatic fare calculation (correct pricing)**  
  - Uses route-wise base fares and adjusts for pass type to calculate total fare.  
  - Eliminates manual price calculation errors.

- **Digital ticket storage (prevent loss/theft)**  
  - Each booking gets a unique `id` and `ticketNumber` (`BUS-<timestamp>`) and is stored in `bookings.json`.  
  - Tickets can be looked up again, reducing risk of physical ticket loss or theft.

- **Booking list for admin**  
  - Admin can load and view recent bookings, including route, pass type, fare, and status.

## Tech Stack

- Backend: Node.js, Express
- Storage: JSON file (`bookings.json`)
- Frontend: HTML, CSS, JavaScript

## How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start server:

   ```bash
   node server.js
   ```

3. Open in browser:

   ```text
   http://localhost:3000
   ```

## Mapping to CodeAlpha Task 3

From the CodeAlpha PDF:

- **Develop an online ticket booking system hosted on the cloud.**  
  → Node.js/Express API + web front-end form provide online booking; the app can be hosted on a cloud platform. [61]

- **Ensure prevention of ticket loss, theft and incorrect pricing.**  
  → Digital ticket records in `bookings.json` prevent loss/theft; automated fare calculation logic prevents manual pricing mistakes. [61]

- **Design the system to handle high traffic by dynamically provisioning servers.**  
  → The system is built as a stateless API that can be scaled horizontally on cloud (prototype uses single server; design is cloud-ready). [61]

- **Focus on scalability and reliability improvements over traditional booking sites.**  
  → Using a centralized backend and digital storage makes bookings more reliable than purely paper-based systems. [61]

- **Test and deploy the system to provide seamless booking experience for users.**  
  → The project includes a simple front-end and REST API that can be tested locally and deployed to a cloud environment. [61]
