
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccountPath = process.env.FIREBASE_ADMIN_CREDENTIAL;

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
