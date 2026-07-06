const mongoose = require('mongoose');

const ALLOWED_CATEGORIES = ['cours', 'atelier', 'conference', 'networking'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
      minlength: [10, 'La description doit contenir au moins 10 caractères'],
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
    },
    location: {
      type: String,
      required: [true, 'Le lieu est requis'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: 'La catégorie doit être : cours, atelier, conference ou networking',
      },
    },
    capacity: {
      type: Number,
      default: 30,
      min: [1, 'La capacité doit être au moins de 1'],
    },
    // Utilisateur qui a créé l'événement (pour les droits de suppression).
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
module.exports.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;
