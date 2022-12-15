const seedProducts = require('../models/products/products.seeder');
const seedUsers = require('../models/users/users.seeder');

async function seed() {
    await seedProducts();
    await seedUsers();
}

// seedUsers().then(console.log('users seeded')).then(process.exit(0));

// try {
//     seed().then(console.log('Seeded the DB')).then(process.exit(0));
// } catch(err) {
//     console.log(err);
// }

module.exports = seed;