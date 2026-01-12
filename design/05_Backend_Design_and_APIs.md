# 05 Backend Design and APIs

## Overview
Node.js + Express server acts as the bridge between Web2 (Firestore/Auth) and Web3 (Blockchain Indexing).

## Architecture

*   **Server**: Express.js
*   **Database**: `firebase-admin` SDK for Firestore.
*   **Blockchain**: `ethers` for listening/parsing.

## API Endpoints

### 1. Public Routes
*   `GET /api/properties`: List all active properties.
*   `GET /api/properties/:id`: Get details for a specific property.
*   `POST /api/convert-currency`: Mock Oracle. Input INR, returns MATIC amount.

### 2. Protected Routes (Middleware: `verifyFirebaseToken`)
*   `POST /api/users/profile`: Create/Update user profile.
*   `GET /api/users/portfolio`: Get investment history.

### 3. Admin Routes (Middleware: `verifyAdmin`)
*   `POST /api/admin/ipfs-upload`: Accepts `multipart/form-data`.
    *   Uploads to **Pinata**.
    *   Returns IPFS Hash.
*   `POST /api/admin/create-property`: Creates initial Firestore record (Status: DRAFT).

## Background Services

### Blockchain Listener (`listener.js`)
Runs continuously to sync chain state to Firestore.

*   **Watch**: `NewPropertyListing(address tokenAddress, uint256 tokenId)`
    *   Action: Find Property in Firestore by `tokenId`. Update `tokenAddress` (ERC-20 address). Set status `ACTIVE`.
*   **Watch**: `SharePurchased(address buyer, uint256 amount)`
    *   Action: Log transaction in `transactions` collection.
    *   Action: Trigger `emailNotificationService`.

### Email Service (`mailer.js`)
Uses `nodemailer` with Gmail SMTP.

*   `sendWelcomeEmail(email)`
*   `sendInvestmentConfirmation(email, txHash, shareAmount)`

## Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Firebase (Service Account)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# Blockchain
MUMBAI_RPC_URL="https://..."
ADMIN_WALLET_ADDRESS=...

# Pinata (IPFS)
PINATA_API_KEY=...
PINATA_SECRET_KEY=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hackathon@gmail.com
SMTP_PASS=app_specific_password
```

## Failure Handling
*   **Uploads**: If Pinata fails, return 500 error to Admin.
*   **Listener**: Wrap listener in `try/catch` with auto-restart logic (PM2 or simple loop).
*   **API**: Global error handler middleware to sanitize errors before sending to client.
