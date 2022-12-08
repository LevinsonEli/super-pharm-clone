const mongoose = require('mongoose');

const DB_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/super-pharm-api';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

mongoose.connection.on('close', () => {
  console.log('MongoDB connection closed');
});

async function mongoConnect() {
 await mongoose.connect(DB_URI);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};