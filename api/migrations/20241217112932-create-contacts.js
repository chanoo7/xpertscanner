'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contactId: {
        allowNull: false,
        type: Sequelize.CHAR(36)
      },
      legalName: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      assignedEmployer: {
        type: Sequelize.STRING
      },
      assignedSites: {
        type: Sequelize.JSON
      },
      designation: {
        type: Sequelize.CHAR(36)
      },
      personalInfo: {
        type: Sequelize.JSON
      },
      employmentInfo: {
        type: Sequelize.JSON
      },
      bankingInfo: {
        type: Sequelize.JSON
      },
      miscInfo: {
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
    await queryInterface.dropTable('contacts');
  }
};