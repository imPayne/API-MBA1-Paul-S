'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('terrains', [
      {
        name: "A",
        is_available: true,
      },
      {
        name: "B",
        is_available: false,
      },
      {
        name: "C",
        is_available: true,
      },
      {
        name: "D",
        is_available: true,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('terrains', null, {});
  },
};