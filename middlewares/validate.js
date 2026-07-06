const { validationResult } = require('express-validator');

// Middleware qui centralise le résultat des validations express-validator.
// Si des règles ont échoué, on répond 400 avec le détail des erreurs.
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides',
      details: result.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
