"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Stations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      target: {
        type: Sequelize.INTEGER,
      },
      actual: {
        type: Sequelize.INTEGER,
      },
      difference: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      lineId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Lines", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      styleId: {
        type: Sequelize.INTEGER,
        allowNull: false, // ✅ Keep it required
      },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Stations");
  },
};
