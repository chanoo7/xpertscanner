'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.CHAR(36)
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      contactId: {
        type: Sequelize.CHAR(36)
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
      },
      allowedClient: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      isLoggedin: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
      },
      isWebLogin: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
      },
      isMobileLogin: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
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
      },
      failedAttempts:{
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,

      },
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};