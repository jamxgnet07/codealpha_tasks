# CodeAlpha Cloud Computing Tasks

This repository contains my completed cloud computing internship tasks for **CodeAlpha**.  
All projects are built with JavaScript/Node.js and focus on cloud‑based deployment, security, and scalability.

## Repository Structure

- `CodeAlpha_DataRedundancy`  
  Data Redundancy Removal System (Task 1)

- `CodeAlpha_SecureSQLAdvanced`  
  Detecting Data Leaks Using SQL Injection (Task 2)

- `CodeAlpha_BusPassSystem`  
  Cloud-Based Bus Pass / Ticket Booking System (Task 3)

- `CodeAlpha_ChatBot`  
  AI-powered Chatbot for websites (Task 4)

Each folder is a separate project with its own source code, configuration, and instructions.

---

## Task 1 – Data Redundancy Removal System

**Goal:**  
Prevent duplicate data from being stored in the database and ensure only unique, verified entries are saved.

**Key features:**

- Checks new records against existing data before insertion.
- Identifies and filters out redundant or false‑positive records.
- Stores only unique and validated entries.
- Improves database accuracy and storage efficiency.

**How to run:**

1. Open the `CodeAlpha_DataRedundancy` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open the browser at the URL shown in the terminal.

---

## Task 2 – Detecting Data Leaks Using SQL Injection

**Goal:**  
Secure user data against SQL injection attacks and reduce the risk of data leaks.

**Key features:**

- Uses parameterized queries / ORM methods to prevent SQL injection.
- Encrypts sensitive user information (AES‑256 or similar approach).
- Validates and sanitizes user input.
- Provides an additional security layer before executing database operations.

**How to run:**

1. Open the `CodeAlpha_SecureSQLAdvanced` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure database credentials in the config file (if required).
4. Start the server:

   ```bash
   npm start
   ```

5. Test login / form inputs through the browser.

---

## Task 3 – Cloud‑Based Bus Pass System

**Goal:**  
Provide an online bus pass/ticket booking system that is reliable, scalable, and suitable for cloud deployment.

**Key features:**

- User interface for booking bus passes or tickets.
- Stores booking details on the backend.
- Focus on preventing ticket loss, theft and incorrect pricing.
- Designed for horizontal scalability when deployed to the cloud.

**How to run:**

1. Open the `CodeAlpha_BusPassSystem` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend/server:

   ```bash
   npm start
   ```

4. Open the browser (for example `http://localhost:3000`) to use the booking interface.

---

## Task 4 – Chatbot

**Goal:**  
Build an AI‑powered chatbot that can respond instantly to user queries on a website.

**Key features:**

- Frontend chat widget integrated into a web page.
- Rule‑based / retrieval‑based response handling.
- Predefined intents and responses for common user queries.
- Easy to embed into existing websites.

**How to run:**

1. Open the `CodeAlpha_ChatBot` folder.
2. Install dependencies if the project uses Node.js:

   ```bash
   npm install
   ```

3. Start the project (for example):

   ```bash
   npm start
   ```

4. Open the browser at the provided URL and interact with the chatbot.

---

## Technologies Used

- JavaScript, HTML, CSS
- Node.js and Express (backend)
- JSON / database storage (depending on task)
- Basic encryption and security practices

---

## Notes

- These projects are developed as part of the **CodeAlpha Cloud Computing Internship**.
- To test any project in detail, please refer to comments in the code or run the project locally as described above.
