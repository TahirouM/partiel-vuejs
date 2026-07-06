// Script pour remplir la base avec quelques événements de démo.
// Usage : npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';

const events = [
  {
    title: 'Atelier Vue 3',
    description: 'Découverte de la Composition API et de Vite en pratique.',
    date: '2026-01-12',
    location: 'EEMI Paris',
    category: 'atelier',
    capacity: 30,
  },
  {
    title: 'Conférence IA & Web',
    description: "Panorama des usages de l'IA dans le développement web moderne.",
    date: '2026-02-03',
    location: 'Auditorium EEMI',
    category: 'conference',
    capacity: 120,
  },
  {
    title: 'Cours Node.js avancé',
    description: 'Construire une API REST robuste avec Express et MongoDB.',
    date: '2026-01-20',
    location: 'Salle B204',
    category: 'cours',
    capacity: 25,
  },
  {
    title: 'Soirée Networking Alumni',
    description: 'Rencontre entre étudiants et anciens de la promo autour d’un verre.',
    date: '2026-02-14',
    location: 'Rooftop EEMI',
    category: 'networking',
    capacity: 80,
  },
  {
    title: 'Atelier Design System',
    description: 'Mettre en place des composants réutilisables et un thème cohérent.',
    date: '2026-03-01',
    location: 'EEMI Paris',
    category: 'atelier',
    capacity: 40,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log(`${events.length} événements insérés.`);
  } catch (err) {
    console.error('Erreur lors du seed :', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
