require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';

async function start() {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Serveur EventHub EEMI démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Impossible de démarrer le serveur :', err.message);
    process.exit(1);
  }
}

start();
