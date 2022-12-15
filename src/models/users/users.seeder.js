const usersMongo = require('./users.mongo');

const adminUser = {
    name: 'admin',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
}

const regularUser = {
  name: 'user',
  email: 'user@test.com',
  password: '123456',
  role: 'user',
};

async function seedUsers() {
  await usersMongo.deleteMany();
  await usersMongo.create(adminUser);
  await usersMongo.create(regularUser);
}

module.exports = seedUsers;
