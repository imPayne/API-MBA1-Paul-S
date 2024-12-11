const swaggerAutogen = require('swagger-autogen')();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const app = express();

// Charger le fichier OpenAPI YAML (OAD)
const swaggerDocument = yaml.load(fs.readFileSync('./OpenApi.yml', 'utf8'));

// Configuration pour swagger-autogen
const doc = {
    info: {
        title: 'API Documentation',
        description: 'Documentation de l\'API pour votre application Express.js',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = 'swagger-output.json';  // Ce fichier contiendra la documentation générée
const endpointsFiles = ['./app.js'];  // Indiquez ici les fichiers de routes API à documenter

// Générer le fichier Swagger (swagger-output.json)
swaggerAutogen(outputFile, endpointsFiles).then(() => {
    console.log('Swagger documentation generated successfully!');
});

// Intégrer Swagger UI pour servir la documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Serveur API en écoute sur http://localhost:3000');
})