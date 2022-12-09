require('dotenv').config();

// const http = require('http');

const app = require('./app');

const { mongoConnect } = require('./db/mongo');
// const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await mongoConnect();

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(`Error occured while starting the server: `);
    console.log(err);
  }
}

startServer();