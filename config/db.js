
const mongoose = require('mongoose');


require('dotenv').config(); 


const mongoURI = process.env.MONGO_URI; 

const connectDB = async () => {
    try {

        await mongoose.connect(mongoURI);
        

        console.log('✅ MongoDB Atlas Connected Successfully.');

    } catch (err) {

        console.error('❌ MongoDB Connection Error:', err.message);
        
        process.exit(1); 
    }
};


module.exports = connectDB;