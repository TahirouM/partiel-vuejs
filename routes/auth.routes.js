const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').isString().trim().isLength({ min: 3 })
      .withMessage('Le nom doit contenir au moins 3 caractères'),
    body('email').isEmail().withMessage("L'email n'est pas valide"),
    body('password').isString().isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  ],
  validate,
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage("L'email n'est pas valide"),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ],
  validate,
  authController.login
);

module.exports = router;
