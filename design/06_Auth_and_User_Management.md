# 06 Auth and User Management

## Authentication Strategy

We use **Firebase Authentication** for user identity, paired with **MetaMask** for blockchain actions.

### 1. Dual-Auth Flow

The application requires both an email (Web2 identity) and a wallet (Web3 identity).

**Registration Steps:**
1.  **Firebase Sign Up**: User enters Email/Password.
    *   Creates Firebase Auth User (`uid`).
2.  **Wallet Connect**: User connects MetaMask.
    *   Frontend gets `walletAddress`.
3.  **Profile Creation**:
    *   Frontend POSTs `{ uid, email, walletAddress, role }` to Backend.
    *   Backend validates `uid` via Firebase Admin SDK.
    *   Backend creates User document in Firestore.

**Login Steps:**
1.  **Firebase Login**: Standard email/pass.
2.  **Wallet Check**: App checks if connected wallet matches the one in Firestore `users` collection.
    *   *Security Note*: If wallet doesn't match, warn user to switch accounts.

### 2. Role-Based Access Control (RBAC)

**Roles:**
*   **Admin**: Can upload properties, mint tokens.
*   **Investor**: Can view and buy.

**Implementation:**
*   **Backend Middleware (`middleware/auth.js`)**:
    1.  Extract `Authorization: Bearer <token>` from header.
    2.  `admin.auth().verifyIdToken(token)` -> Decodes `uid`.
    3.  Fetch user role from Firestore `users/{uid}`.
    4.  If route is `adminOnly` and role != 'admin', return 403 Forbidden.

### 3. Security Considerations
*   **JWT Validation**: Every protected API request validates the Firebase JWT.
*   **Role Storage**: Roles are stored in Firestore (server-side), not in local storage or client-side code where they can be manipulated.
*   **Wallet Binding**: A wallet address creates a semi-permanent bond to a user profile to prevent account sharing or confusion.

## Environment Variables (Frontend)
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```
