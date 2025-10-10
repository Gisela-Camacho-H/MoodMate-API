// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger'); 

dotenv.config();
connectDB();


const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/content', require('./routes/content')); 
app.use('/api/users', require('./routes/users')); 
app.use('/api/moods', require('./routes/moods'));     

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => console.log(`Server running in http://localhost:${PORT}`));