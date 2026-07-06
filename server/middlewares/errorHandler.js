// Middleware de gestion d'erreurs centralisé.
// Il attrape ce que les controllers passent via next(err) et
// traduit les erreurs Mongoose en codes HTTP cohérents.
module.exports = (err, req, res, next) => {
  console.error(err);

  // Erreur de validation Mongoose -> 400
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Données invalides',
      details: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // ObjectId mal formé (ex: GET /events/abc) -> 400
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Identifiant invalide : ${err.value}` });
  }

  // Violation d'unicité (ex: email déjà utilisé) -> 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({ error: `Ce ${field} est déjà utilisé` });
  }

  // Sinon erreur serveur -> 500
  return res.status(500).json({ error: 'Erreur interne du serveur' });
};
