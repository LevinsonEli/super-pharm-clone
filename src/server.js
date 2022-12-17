require('dotenv').config();

// const http = require('http');
const cron = require('node-cron');

const app = require('./app');

const { mongoConnect, } = require('./db/mongo');
const seed = require('./db/seed');
// const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

// cron.schedule('5 * * * *', async function () {
//   console.log('calculated the reviews statistics');
// });

async function startServer() {
  try {
    await mongoConnect();

    // await seed();

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(`Error occured while starting the server: `);
    console.log(err);
  }
}

startServer();