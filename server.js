// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

const swaggerSpecs = require('./swagger'); 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const contentRoutes = require('./routes/content');


mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected Successfully.'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); 
    });


app.use(cors());
app.use(express.json()); 


try {

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    console.log('✅ Swagger documentación dinámica cargada y montada en /api-docs.');
} catch (e) {
    console.error('❌ Error al cargar Swagger:', e.message);

}



app.get('/', (req, res) => {
    res.send('Welcome to MoodMate API! Use /api-docs for documentation.');
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to MoodMate API endpoints! Check /api-docs for details.' 
    });
});

app.use('/api/content', contentRoutes);


app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});