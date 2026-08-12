# CodeAlpha Task 2 – Detecting Data Leaks Using SQL Injection (Advanced)

## Overview

This project is an **advanced secure cloud backend** that protects user data against SQL injection attacks. It uses AES-256 encryption for credentials, JWT authentication, role-based access, a capability code mechanism, parameterized SQL queries, and security logs to detect and prevent data leaks.

## Features

- **AES-256 encrypted credential storage**  
  - User passwords are encrypted using AES-256 before being stored in SQLite. Plain-text passwords are never saved.

- **Protection against SQL injection**  
  - All main queries (signup, login, secure query) use parameterized SQL (`?` placeholders), preventing string-based injection.

- **Capability code mechanism**  
  - Sensitive admin query (`/api/secure-query`) requires a valid capability code (e.g. `SECURE-CODE-ADV-2026`) in addition to authentication.

- **Double-layer security protocol**  
  - First layer: JWT-based login (username + password).  
  - Second layer: role-based access (`admin` only) + capability code for secure queries.  

- **Security logs**  
  - Key events (login success/failure, signup errors, capability code failures, unsafe query attempts) are logged in `security_logs` table.  
  - Admin can view recent logs via `/api/security-logs`.

- **Unsafe query demo**  
  - For educational purposes, an `/api/unsafe-query` route demonstrates how string-concatenated SQL is vulnerable to injection.

## Tech Stack

- Backend: Node.js, Express
- Database: SQLite (`db.sqlite`)
- Security: CryptoJS AES, JSON Web Tokens (JWT)
- Frontend: HTML, CSS, JavaScript

## How to Run

1. Create `.env` file:

   ```env
   PORT=3001
   JWT_SECRET=super-strong-jwt-secret-2026
   AES_SECRET=my-strong-aes-256-secret-key-123
   CAPABILITY_CODE=SECURE-CODE-ADV-2026
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server.js
   ```

4. Open in browser:

   ```text
   http://localhost:3001
   ```

## Usage Flow

1. **Signup**  
   - Create users (admin/user) via signup form. Password stored encrypted.

2. **Login**  
   - Login to receive a JWT token. Token is shown on UI and used for all protected routes.

3. **Admin Dashboard & Logs**  
   - As admin, load dashboard (users count, logs count) and view recent security logs.

4. **Secure Query (Admin + Capability)**  
   - As admin, run secure query by providing username filter + capability code. Results come from parameterized SQL.

5. **Unsafe Query Demo**  
   - Run unsafe query with a raw filter (e.g. `admin' OR '1'='1`) to show how injection works if strings are concatenated.

## Mapping to CodeAlpha Task 2

From the CodeAlpha PDF:

- **Build a cloud system that secures user data against SQL injection attacks.**  
  → This backend uses parameterized queries, JWT auth, role checks, and capability code to prevent injection-based data leaks. [61]

- **Use AES-256 encryption to securely store user credentials and sensitive info.**  
  → Passwords are encrypted using AES-256 via CryptoJS and stored in SQLite as encrypted text. [61]

- **Implement a capability code mechanism to inject SQL securely and control server access.**  
  → `/api/secure-query` only executes when the admin supplies the correct capability code along with a valid JWT. [61]

- **Provide a double-layer security protocol to prevent data leaks via SQL injection.**  
  → Layer 1: JWT authentication; Layer 2: admin role + capability code + parameterized queries. [61]

- **Make the system accessible over the internet without heavy system requirements.**  
  → Node.js + Express + SQLite form a lightweight stack that can be deployed on cloud platforms such as Render/Railway. [61]
