"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const lines = [];
    for (let i = 1; i <= 5; i++) {
      lines.push({
        name: `Line ${i}`,
        status: "online",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("Lines", lines);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Lines", null, {});
  },
};
