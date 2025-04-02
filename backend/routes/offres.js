
const express = require('express');
const router = express.Router();
const Offre = require('../models/Offre');
const auth = require('../middleware/auth');

// @route   GET api/offres
// @desc    Obtenir toutes les offres
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const offres = await Offre.find().sort({ nom: 1 });
    res.json(offres);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/offres/:id
// @desc    Obtenir une offre par son ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id);
    
    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json(offre);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/offres
// @desc    Créer une nouvelle offre
// @access  Private (Superviseur, Responsable)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { nom, description, type, prix } = req.body;

    const nouvelleOffre = new Offre({
      nom,
      description,
      type,
      prix
    });

    const offre = await nouvelleOffre.save();
    
    res.json(offre);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/offres/:id
// @desc    Mettre à jour une offre
// @access  Private (Superviseur, Responsable)
router.put('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const offre = await Offre.findById(req.params.id);
    
    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    const { nom, description, type, prix } = req.body;
    
    // Mettre à jour les champs
    if (nom !== undefined) offre.nom = nom;
    if (description !== undefined) offre.description = description;
    if (type !== undefined) offre.type = type;
    if (prix !== undefined) offre.prix = prix;

    await offre.save();

    res.json(offre);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/offres/:id
// @desc    Supprimer une offre
// @access  Private (Superviseur, Responsable)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const offre = await Offre.findById(req.params.id);
    
    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    await Offre.findByIdAndDelete(req.params.id);

    res.json({ message: 'Offre supprimée' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
