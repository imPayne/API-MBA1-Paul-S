const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Documentation',
        description: 'Documentation de l\'API pour votre application Express.js',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};s

const outputFile = 'swagger-output.json';
const endpointsFiles = ['../app.js'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    console.log('Swagger documentation generated successfully!');
    // Vous pouvez activer cette ligne si vous souhaitez démarrer le serveur après la génération
    // require('./app');
});
