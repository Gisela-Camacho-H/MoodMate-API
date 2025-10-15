// config/firebase.js
const admin = require('firebase-admin');

let serviceAccount;

try {
  if (process.env.FIREBASE_CREDS_BASE64) {
    // If using base64 encoded version
    const credsJson = Buffer.from(process.env.FIREBASE_CREDS_BASE64, 'base64').toString('utf8');
    serviceAccount = JSON.parse(credsJson);
    console.log('✅ Loaded Firebase credentials from Base64');
  } else if (process.env.FIREBASE_CREDS_JSON) {
    // If using direct JSON string
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDS_JSON);
    console.log('✅ Loaded Firebase credentials from JSON string');
  } else {
    throw new Error('No Firebase credentials found in environment variables');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('🔥 Firebase Admin initialized successfully');
  
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  // Optionally, you can choose to not throw if Firebase is optional
  // throw error;
}

module.exports = admin;