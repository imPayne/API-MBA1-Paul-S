const { Sequelize } = require('sequelize');
const process = require('process');
const config = require(__dirname + '/../config/config.json')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

// Importation manuelle des modèles
const User = require('./User');
const Terrain = require('./Terrain');
const Reservation = require('./Reservation');

// Ajout des modèles au db
db.User = User;
db.Terrain = Terrain;
db.Reservation = Reservation;

// Synchronisation des modèles (si nécessaire)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
