const Event = require('../models/Event.model');

// GET /api/events
// Liste les événements, avec filtres optionnels ?category= et ?q=
// (?q= recherche dans le titre, insensible à la casse).
exports.list = async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: 'i' };

    const events = await Event.find(filter).sort({ date: 1 });
    return res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id
// Récupère un événement par son identifiant.
exports.getById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Événement introuvable' });
    }
    return res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

// POST /api/events  (protégé par JWT)
// Crée un nouvel événement.
exports.create = async (req, res, next) => {
  try {
    const { title, description, date, location, category, capacity } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      capacity,
      owner: req.user.id, // l'utilisateur authentifié devient le propriétaire
    });
    return res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:id  (protégé par JWT)
// Supprime un événement.
exports.remove = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Événement introuvable' });
    }

    // 403 : l'utilisateur est authentifié mais n'est pas le propriétaire.
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer cet événement" });
    }

    await event.deleteOne();
    return res.status(200).json({ message: 'Événement supprimé', id: event._id });
  } catch (err) {
    next(err);
  }
};
