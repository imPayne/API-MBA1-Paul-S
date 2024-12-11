'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("users");
  },
};

