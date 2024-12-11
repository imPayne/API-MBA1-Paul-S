'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        username: "admybad",
        password: "astrongpassword",
        is_admin: true,
      },
      {
        username: "test",
        password: "",
        is_admin: false,
      },
      {
        username: "marvin",
        password: "",
        is_admin: false,
      },
      {
        username: "hugo",
        password: "",
        is_admin: false,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
