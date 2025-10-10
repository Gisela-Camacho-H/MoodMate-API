const express = require('express');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecd = require('./swagger');

require('dotenv').config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('./api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecd));

app.get('/', (req, res) => res.send('MoodMate API is running!'));

app.listen(PORT, () => console.log(`Server running in http://Localhost:${PORT}`));
