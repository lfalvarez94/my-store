'use strict';

const { DataTypes } = require('sequelize');
const { CUSTOMER_TABLE } = require('./../models/customerModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.changeColumn(CUSTOMER_TABLE, 'user_id',
      {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
      }
    );

    //Otra forma de agregar restricciones
    /*await queryInterface.addConstraint(CUSTOMER_TABLE, {
      fields: ['user_id'],
      type: 'unique',
      name: 'unique_user_id',
    });*/
  },

  async down (queryInterface) {
    //await queryInterface.removeConstraint(CUSTOMER_TABLE, 'unique_user_id');
  }
};
