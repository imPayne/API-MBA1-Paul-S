const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/init'); // Importer la connexion Sequelize
const app = express();
const userRoutes = require('./routes/users');
const terrainRoutes = require('./routes/terrains');
const reservationRoutes = require('./routes/reservations');

// Middleware pour parser les données JSON
app.use(bodyParser.json());


// Enregistrement des routes
app.use('/api/users', userRoutes);
app.use('/api/terrains', terrainRoutes);
app.use('/api/reservations', reservationRoutes);

// Fonction d'initialisation du serveur
const startServer = async () => {
  try {
    // Test de la connexion à la base de données
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Synchronisation des modèles avec la base de données
    await sequelize.sync({ force: false });
    console.log('Tables synchronized!');

    // Démarrage du serveur
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Lancer le serveur
startServer();
