const { users } = require('./models'); // adjust path as needed
const bcrypt = require('bcrypt');

async function seedUsers() {
  try {
    const hashedPassword = await bcrypt.hash('Chennai@123', 10);
    await users.bulkCreate([
      {
        userId: 'uuid1',
        username: '9047047146',
        password: hashedPassword,
        role: 'su',
        type: 'owner',
        allowedClient: 'global',
        firstName: 'chandrasekaran',
        lastName: 'P',
        createdBy: 'system',
        updatedBy: 'system',
        isActive: 1,
        failedAttempts: 0
      },
      // Add more users as needed
    ]);
    console.log('Users seeded!');
  } catch (err) {
    console.error('Failed to seed users:', err);
  }
}

seedUsers();
