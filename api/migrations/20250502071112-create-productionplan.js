'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productionplans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      style: {
        type: Sequelize.STRING
      },
      routeMap: {
        type: Sequelize.STRING
      },
      line: {
        type: Sequelize.STRING
      },
      shift: {
        type: Sequelize.STRING
      },
      productionPlanFrom: {
        type: Sequelize.DATE
      },
      productionPlanEnd: {
        type: Sequelize.DATE
      },
      targetQty: {
        type: Sequelize.INTEGER
      },
      noOfPositions: {
        type: Sequelize.INTEGER,
        defaultValue: 50 // Default value from the model
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productionplans');
  }
};
