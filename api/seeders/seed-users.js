'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Chennai@123', 10);
    await queryInterface.bulkInsert('users', [
      {
        userId: '0',
        username: '9047047147',
        password: hashedPassword,
        role: 'su',
        type: 'owner',
        allowedClient: 'global',
        firstName: 'chandrasekaran',
        lastName: 'P',
        createdBy: 'system',
        updatedBy: 'system',
        isActive: 1,
        failedAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { username: '9047047147' }, {});
  }
};
