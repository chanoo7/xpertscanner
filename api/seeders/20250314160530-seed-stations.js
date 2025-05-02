"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const stations = [];
    
    for (let i = 1; i <= 5; i++) { // Loop for each Line
      // ✅ Generate common values for each 20 stations group
      const target1 = Math.floor(Math.random() * 1000);
      const actual1 = Math.floor(Math.random() * 1000);
      const target2 = Math.floor(Math.random() * 1000);
      const actual2 = Math.floor(Math.random() * 1000);
      const target3 = Math.floor(Math.random() * 1000);
      const actual3 = Math.floor(Math.random() * 1000);

      for (let j = 1; j <= 60; j++) {
        let styleId, target, actual;

        if (j <= 20) {
          styleId = 1;
          target = target1;
          actual = actual1;
        } else if (j <= 40) {
          styleId = 2;
          target = target2;
          actual = actual2;
        } else {
          styleId = 3;
          target = target3;
          actual = actual3;
        }

        stations.push({
          name: `Station ${j} (Line ${i})`,
          target: target,
          actual: actual,
          difference: target - actual, // ✅ Ensure gap calculation
          status: "online",
          lineId: i,
          styleId: styleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    console.log(("stations", stations));
    await queryInterface.bulkInsert("stations", stations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("stations", null, {});
  },
};
