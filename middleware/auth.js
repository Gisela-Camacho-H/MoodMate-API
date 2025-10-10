
const admin = require('../config/firebase');

const protect = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Authorization denied. Token format is missing or invalid.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decodedToken = await admin.auth().verifyIdToken();

        const userId = decodedToken.uid;

        req.user = {
            userId: userId
        };

        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ msg: 'Token is not valid or has expired.'});
    }
};

module.exports = protect;