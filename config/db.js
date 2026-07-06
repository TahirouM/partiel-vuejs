const mongoose = require('mongoose');

// Connexion à MongoDB.
async function connectDB(uri) {
  await mongoose.connect(uri);
  console.log('MongoDB connecté');
}

module.exports = connectDB;
