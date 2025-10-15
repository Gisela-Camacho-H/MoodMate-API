// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');


const usersRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected Successfully.'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);

        process.exit(1); 
    });



app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




try {
    const file = fs.readFileSync('./swagger.yaml', 'utf8');
    const swaggerDocument = YAML.parse(file);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
    console.error('Error loading or parsing swagger.yaml:', e.message);
}



app.get('/', (req, res) => {
    res.send('Welcome to MoodMate API! Use /api-docs for documentation.');
});


app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to MoodMate API endpoints! Check /api-docs for details.' 
    });
});


app.use('/api', usersRoutes);
app.use('/api', contentRoutes);


app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});