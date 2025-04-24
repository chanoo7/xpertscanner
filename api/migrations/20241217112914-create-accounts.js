'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId: {
        allowNull: false,
        type: Sequelize.CHAR(36)
      },
      legalName: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      contactInfo: {
        type: Sequelize.JSON
      },
      billingInfo: {
        type: Sequelize.JSON
      },
      bankingInfo: {
        type: Sequelize.JSON
      },
      isClient: {
        type: Sequelize.BOOLEAN
      },
      isVendor: {
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.CHAR(36)
      },
      updatedBy: {
        allowNull: false,
        type: Sequelize.CHAR(36)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};