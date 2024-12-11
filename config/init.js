// config/init.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',   // 'localhost' car l'app est locale
  dialect: process.env.DB_DIALECT || 'mysql',
  port: process.env.DB_PORT || 3306,          // Port exposé par Docker
  database: process.env.DB_NAME || 'database_development',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
