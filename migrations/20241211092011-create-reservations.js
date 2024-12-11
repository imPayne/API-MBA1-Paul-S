'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reservations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nom de la table associée
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      terrain_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'terrains',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      reservation_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      reservation_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 45,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reservations');
  },
};

