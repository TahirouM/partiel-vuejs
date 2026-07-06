const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Event = require('../models/Event.model');

// Helper : inscrit un utilisateur et retourne son token JWT.
async function getToken(email = 'alice@eemi.com') {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Alice',
    email,
    password: 'password123',
  });
  return res.body.token;
}

// Un owner factice pour créer des événements directement en base.
const OWNER = new mongoose.Types.ObjectId();

describe('GET /api/events', () => {
  test('retourne 200 et la liste des événements', async () => {
    await Event.create({
      title: 'Atelier Vue',
      description: 'Un atelier pour découvrir Vue.js',
      date: new Date('2026-01-12'),
      location: 'EEMI',
      category: 'atelier',
      capacity: 30,
      owner: OWNER,
    });

    const res = await request(app).get('/api/events');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Atelier Vue');
  });

  test('filtre par catégorie avec ?category=', async () => {
    await Event.create([
      {
        title: 'Atelier Vue',
        description: 'Un atelier pour découvrir Vue.js',
        date: new Date('2026-01-12'),
        location: 'EEMI',
        category: 'atelier',
        owner: OWNER,
      },
      {
        title: 'Conférence IA',
        description: "Une conférence sur l'intelligence artificielle",
        date: new Date('2026-02-01'),
        location: 'EEMI',
        category: 'conference',
        owner: OWNER,
      },
    ]);

    const res = await request(app).get('/api/events?category=conference');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('conference');
  });
});

describe('POST /api/events', () => {
  test('retourne 401 sans token JWT', async () => {
    const res = await request(app).post('/api/events').send({
      title: 'Atelier Vue',
      description: 'Un atelier pour découvrir Vue.js',
      date: '2026-01-12',
      location: 'EEMI',
      category: 'atelier',
    });

    expect(res.status).toBe(401);
  });

  test('retourne 400 avec un body invalide (titre trop court)', async () => {
    const token = await getToken();

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'ab', // trop court
        description: 'court', // trop court
        date: 'pas-une-date',
        category: 'inconnue',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Données invalides');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  test('retourne 201 avec un body valide et un token', async () => {
    const token = await getToken();

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Atelier Vue',
        description: 'Un atelier pour découvrir Vue.js',
        date: '2026-01-12',
        location: 'EEMI',
        category: 'atelier',
        capacity: 30,
      });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe('Atelier Vue');
    expect(res.body.capacity).toBe(30);
    expect(res.body.owner).toBeDefined();
  });
});

describe('GET /api/events/:id', () => {
  test('retourne 404 pour un id inexistant', async () => {
    const res = await request(app).get('/api/events/64b7f0000000000000000000');
    expect(res.status).toBe(404);
  });

  test('retourne 400 pour un id mal formé', async () => {
    const res = await request(app).get('/api/events/not-an-id');
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/events/:id', () => {
  // Helper : crée un événement en tant qu'utilisateur donné et renvoie son id.
  async function createEvent(token) {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Atelier Vue',
        description: 'Un atelier pour découvrir Vue.js',
        date: '2026-01-12',
        location: 'EEMI',
        category: 'atelier',
      });
    return res.body._id;
  }

  test('le propriétaire peut supprimer son événement (200)', async () => {
    const token = await getToken('owner@eemi.com');
    const id = await createEvent(token);

    const res = await request(app)
      .delete(`/api/events/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  test("retourne 403 si un autre utilisateur tente de supprimer l'événement", async () => {
    const ownerToken = await getToken('owner@eemi.com');
    const id = await createEvent(ownerToken);

    // Un second utilisateur, authentifié mais non propriétaire.
    const otherToken = await getToken('intrus@eemi.com');

    const res = await request(app)
      .delete(`/api/events/${id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  test('retourne 401 sans token', async () => {
    const res = await request(app).delete('/api/events/64b7f0000000000000000000');
    expect(res.status).toBe(401);
  });
});
