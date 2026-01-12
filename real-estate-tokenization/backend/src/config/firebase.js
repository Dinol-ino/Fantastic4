// backend/src/config/firebase.js
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Firebase Admin with credentials from .env
// You will need to download a serviceAccountKey.json from Firebase Console later
// For now, we can use environment variables if formatted correctly, 
// OR simpler: just use default application credentials for local testing.

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle newlines in private key string
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  console.log("Firebase Admin Initialized");
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };