# CodeAlpha Task 1 – Data Redundancy Removal System

## Overview

This project implements a **Data Redundancy Removal System** that cleans a cloud-style database by rejecting invalid records, detecting duplicates, and storing only unique verified data. It is built using Node.js, Express, a JSON file as the database, and a simple web dashboard.

## Features

- **Redundant vs False Positive classification**  
  - Records with missing fields, invalid email, or non-10-digit phone are classified as *False Positive* and rejected.  
  - Records with existing email or phone are classified as *Redundant* (duplicate) and not inserted.

- **Validation mechanism against existing data**  
  - On every new record, the system reads the existing JSON database and checks email/phone collision before insert.

- **Duplicate prevention in cloud database**  
  - Duplicates are detected using normalized email/phone comparison and blocked before write.

- **Unique verified data storage**  
  - Valid, non-duplicate records are stored with a unique ID and status `Verified Unique` in `database.json`.

- **Accuracy and efficiency tools**  
  - Admin dashboard displays total records, allows search/filter, delete, and CSV export to keep the dataset clean.

## Tech Stack

- Backend: Node.js, Express
- Storage: JSON file (`database.json`)
- Frontend: HTML, CSS, JavaScript

## How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   node server.js
   ```

3. Open in browser:

   ```text
   http://localhost:3000
   ```

## Mapping to CodeAlpha Task 1

From the CodeAlpha PDF:

- **Design a system that identifies and classifies data as redundant or false positive.**  
  → The backend validation logic marks invalid records as `False Positive` and duplicates as `Redundant` before storage. [61]

- **Implement a validation mechanism to check new data against existing data.**  
  → On each insert, the system loads `database.json` and checks email/phone against existing entries. [61]

- **Prevent duplicate data from being added into the cloud database.**  
  → Duplicate records are detected and never appended to the JSON database. [61]

- **Append only unique and verified data entries to the database.**  
  → Only records with status `Verified Unique` are written to `database.json`. [61]

- **Ensure database accuracy and efficiency by removing or avoiding redundancy.**  
  → By rejecting false positives and duplicates and providing search/delete tools, the database remains accurate and efficient. [61]
