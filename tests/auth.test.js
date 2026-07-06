const request = require('supertest');
const app = require('../app');

describe('POST /api/auth/register', () => {
  test('crée un utilisateur et retourne un token (201)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bob',
      email: 'bob@eemi.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('bob@eemi.com');
    // Le mot de passe ne doit jamais être renvoyé.
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  test('retourne 400 avec un email invalide', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bob',
      email: 'pas-un-email',
      password: 'password123',
    });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  test('retourne un token avec de bons identifiants (200)', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Carol',
      email: 'carol@eemi.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'carol@eemi.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('retourne 401 avec un mauvais mot de passe', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Carol',
      email: 'carol@eemi.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'carol@eemi.com',
      password: 'mauvais',
    });

    expect(res.status).toBe(401);
  });
});
