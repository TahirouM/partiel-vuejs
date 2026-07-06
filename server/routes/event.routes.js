const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const eventController = require('../controllers/event.controller');
const { ALLOWED_CATEGORIES } = require('../models/Event.model');

const router = express.Router();

// Routes publiques (lecture)
router.get('/', eventController.list);
router.get('/:id', eventController.getById);

// Règles de validation pour la création d'un événement
const eventValidators = [
  body('title').isString().trim().isLength({ min: 3 })
    .withMessage('Le titre doit contenir au moins 3 caractères'),
  body('description').isString().trim().isLength({ min: 10 })
    .withMessage('La description doit contenir au moins 10 caractères'),
  body('date').isISO8601().withMessage('La date doit être une date valide (ISO 8601)'),
  body('location').isString().trim().notEmpty()
    .withMessage('Le lieu est requis'),
  body('category').isIn(ALLOWED_CATEGORIES)
    .withMessage(`La catégorie doit être : ${ALLOWED_CATEGORIES.join(', ')}`),
  body('capacity').optional().isInt({ min: 1 })
    .withMessage('La capacité doit être un entier positif'),
];

// Routes d'écriture (auth retirée pour ce partiel front : pas de login requis)
router.post('/', eventValidators, validate, eventController.create);
router.delete('/:id', eventController.remove);

module.exports = router;
