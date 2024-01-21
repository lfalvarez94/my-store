'use strict';

const { USER_TABLE } = require('./../models/userModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE , 'recovery_token', {
      allowNull: true,
      type: Sequelize.DataTypes.STRING
    })
  },

  async down (queryInterface) {
    await queryInterface.removeColumn(USER_TABLE , 'recovery_token');
  }
};
