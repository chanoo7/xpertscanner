'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      siteId: {
        allowNull: false,
        type: Sequelize.CHAR(36)
      },
      legalName: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      siteInfo: {
        type: Sequelize.JSON
      },
      clientId: {
        allowNull: false,
        type: Sequelize.CHAR(36)
      },
      assignedVendors: {
        type: Sequelize.JSON
      },
      siteLocation: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('sites');
  }
};