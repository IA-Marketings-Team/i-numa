
const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// @route   GET api/teams
// @desc    Obtenir toutes les équipes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find().sort({ nom: 1 });
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/teams/:id
// @desc    Obtenir une équipe par son ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    res.json(team);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/teams
// @desc    Créer une nouvelle équipe
// @access  Private (Superviseur, Responsable)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { nom, fonction, description } = req.body;

    const nouvelleTeam = new Team({
      nom,
      fonction,
      description
    });

    const team = await nouvelleTeam.save();
    
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/teams/:id
// @desc    Mettre à jour une équipe
// @access  Private (Superviseur, Responsable)
router.put('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    const { nom, fonction, description } = req.body;
    
    // Mettre à jour les champs
    if (nom !== undefined) team.nom = nom;
    if (fonction !== undefined) team.fonction = fonction;
    if (description !== undefined) team.description = description;

    await team.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/teams/:id
// @desc    Supprimer une équipe
// @access  Private (Superviseur, Responsable)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.json({ message: 'Équipe supprimée' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
