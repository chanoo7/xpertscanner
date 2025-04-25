"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const styles = [
      { id: 1, name: "Style 1", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Style 2", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Style 3", createdAt: new Date(), updatedAt: new Date() },
    ];
    await queryInterface.bulkInsert("Styles", styles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Styles", null, {});
  },
};
