# EventHub EEMI — API REST

Mini API de gestion d'événements. **Node.js + Express + MongoDB**, authentification JWT, mots de passe hashés (bcrypt).

## Installation

```bash
npm install
cp .env.example .env   # puis renseigner MONGO_URI et JWT_SECRET
```

Il faut une base **MongoDB** accessible (locale ou distante).

## Lancement

```bash
npm start        # production
npm run dev      # dev (redémarrage auto)
npm test         # tests (base MongoDB en mémoire, aucune vraie base requise)
```

Serveur sur `http://localhost:3000` (port réglable via `PORT` dans `.env`).

## Variables d'environnement

| Variable         | Description                | Exemple                               |
| ---------------- | -------------------------- | ------------------------------------- |
| `PORT`           | Port du serveur            | `3000`                                |
| `MONGO_URI`      | URI MongoDB                | `mongodb://127.0.0.1:27017/eventhub`  |
| `JWT_SECRET`     | Secret de signature JWT    | `une_chaine_longue_aleatoire`         |
| `JWT_EXPIRES_IN` | Durée de validité du token | `1d`                                  |

## Routes

| Méthode  | Route                | JWT | Description                              |
| -------- | -------------------- | :-: | ---------------------------------------- |
| `POST`   | `/api/auth/register` |     | Créer un utilisateur, renvoie un token   |
| `POST`   | `/api/auth/login`    |     | Connexion, renvoie un token              |
| `GET`    | `/api/events`        |     | Liste (filtres `?category=` et `?q=`)    |
| `GET`    | `/api/events/:id`    |     | Récupérer un événement                   |
| `POST`   | `/api/events`        | ✅  | Créer un événement                       |
| `DELETE` | `/api/events/:id`    | ✅  | Supprimer (réservé au propriétaire)      |

Routes protégées : header `Authorization: Bearer <token>`.
Seul le créateur d'un événement peut le supprimer (sinon **403**).
Catégories : `cours`, `atelier`, `conference`, `networking`.

## Exemples

```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@eemi.com","password":"password123"}'

# Créer un événement (avec le token reçu)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Atelier Vue","description":"Un atelier pour découvrir Vue.js","date":"2026-01-12","location":"EEMI","category":"atelier","capacity":30}'

# Lister
curl "http://localhost:3000/api/events?category=atelier"
```

Codes HTTP : `200` `201` `400` `401` `403` `404` `409` `500`.

---

## Partie 1 — Réponses théoriques

### Q1. Node.js et asynchrone

Node.js est adapté aux API non bloquantes car il fonctionne de manière asynchrone : quand une requête prend du temps, le serveur n'attend pas et continue à traiter les autres. Par exemple, un export qui prend 500 ms ne bloque pas le serveur.

Avec des callbacks, dès qu'on enchaîne les opérations le code devient imbriqué et dur à lire :

```js
db.query('SELECT * FROM users', (err, rows) => {
  if (err) return res.status(500).json({ error: err.message });
  fs.writeFile('export.csv', convertToCsv(rows), (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.download('export.csv');
  });
});
```

Avec async/await, on écrit dans l'ordre, étape par étape :

```js
const rows = await db.query('SELECT * FROM users');
await fs.promises.writeFile('export.csv', convertToCsv(rows));
res.download('export.csv');
```

### Q2. Express et middlewares

`express.json()` lit le body JSON envoyé par le client et le rend accessible via `req.body`. Sans lui, `req.body` est vide.

Un middleware **global** (`app.use()`) s'applique à toutes les requêtes ; un middleware **de route** (`app.post('/x', mw, handler)`) ne tourne que pour cette route.

```js
app.use(express.json());                         // global
app.post('/sessions/start', verifyPayment, handler); // route seulement
```

Ici `verifyPayment` ne s'exécute que pour démarrer une charge, pas pour lire un statut.

### Q3. Mongoose : Schema, Model, Document

Le **Schema** définit la structure des données (champs, types, défauts). Le **Model** est créé à partir du Schema et fait le lien avec une collection MongoDB (comme une table). Un **Document** est une instance concrète du Model (un enregistrement).

- `find()` : renvoie plusieurs documents selon un critère.
- `findById()` : renvoie un seul document par son `_id`.
- `save()` : enregistre un document créé ou modifié.

### Q4. Authentification JWT

**Inscription** : l'utilisateur envoie email + mot de passe, qu'on hash avec bcrypt avant de stocker (jamais en clair).

**Connexion** : on retrouve l'utilisateur par email, on compare le mot de passe avec `bcrypt.compare()`. Si ça correspond, on génère un JWT signé qu'on renvoie au client.

**Middleware d'authentification** : intercepte les requêtes protégées, vérifie le token (valide et non expiré) avant le handler ; sinon il bloque.

- **401** : non authentifié (token absent, invalide ou expiré).
- **403** : authentifié mais pas le droit d'accéder à la ressource.
