// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MoodMate API Documentation',
      version: '1.0.0',
      description: 'API para la aplicación móvil MoodMate. Usa autenticación de Firebase ID Token.',
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor Local/Producción',
      },
    ],
    components: {
        securitySchemes: {
            FirebaseIdToken: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'Firebase ID Token (Debe enviarse en formato: Bearer <token>)',
            }
        }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;