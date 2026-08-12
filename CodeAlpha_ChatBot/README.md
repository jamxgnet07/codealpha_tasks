# CodeAlpha Task 4 – AI-Powered Website Chatbot

## Overview

This project is an **AI-style chatbot** for websites, implemented as a retrieval-based system using predefined patterns. It provides instant responses to common commercial queries, integrates into a web page, and can be extended with more patterns or real AI APIs later.

## Features

- **AI-powered (retrieval-based) chatbot logic**  
  - Uses predefined patterns for categories like greetings, pricing, contact, delivery, refund, services, location, and help.  
  - Matches user messages to these patterns and returns appropriate responses.

- **Instant responses via API**  
  - Frontend sends user messages to `/api/chat` (Node.js backend).  
  - Backend processes input and returns a reply immediately, which is shown in the chat UI.

- **Predefined input patterns for commercial use**  
  - Patterns are designed around common business queries (pricing, support, orders, refunds, etc.) to make the chatbot useful for customer support.

- **Fallback responses**  
  - If no exact pattern matches, the bot uses keyword-based fallback logic to provide helpful guidance and ask the user to rephrase, making it feel more “AI-like”.

- **Website integration**  
  - Chat widget UI is built with HTML/CSS/JavaScript and can be embedded into any web page.  
  - Messages appear as user/bot bubbles in a scrollable chat window.

## Tech Stack

- Backend: Node.js, Express
- Bot Logic: JavaScript (pattern matching in `chatbot-data.js`)
- Frontend: HTML, CSS, JavaScript (chat UI)

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

## Mapping to CodeAlpha Task 4

From the CodeAlpha PDF:

- **Design an AI-powered chatbot using either retrieval-based or generative models.**  
  → This chatbot uses a retrieval-based approach with predefined patterns and fallback logic. [61]

- **Enable instant responses to user queries on websites.**  
  → Frontend sends requests to the backend API and displays responses immediately in the chat interface. [61]

- **Train the chatbot with predefined input patterns for commercial use.**  
  → `chatbot-data.js` contains commercial patterns (pricing, delivery, refund, contact, etc.), which act as training rules for the bot. [61]

- **Integrate the chatbot seamlessly with the target website interface.**  
  → The chat widget is implemented in HTML/CSS/JS and can be embedded into any web page. [61]

- **Optimize and test the chatbot for accuracy and user engagement.**  
  → The pattern list and fallback logic can be extended based on testing; the current implementation is optimized for common support queries. [61]
