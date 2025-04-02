
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/users
// @desc    Obtenir tous les utilisateurs
// @access  Private (Superviseur, Responsable)
router.get('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/users/clients
// @desc    Obtenir tous les clients
// @access  Private (Agents, Superviseur, Responsable)
router.get('/clients', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['agent_phoner', 'agent_visio', 'superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const clients = await User.find({ role: 'client' }).select('-password');
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/users/agents
// @desc    Obtenir tous les agents
// @access  Private (Superviseur, Responsable)
router.get('/agents', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const agents = await User.find({
      role: { $in: ['agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing'] }
    }).select('-password');
    
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/users/:id
// @desc    Obtenir un utilisateur par son ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur a les droits appropriés
    if (req.user.id !== req.params.id && 
        !['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/users/:id
// @desc    Mettre à jour un utilisateur
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (req.user.id !== req.params.id && 
        !['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Filtrer les champs à mettre à jour en fonction du rôle
    const updateData = {};
    for (const [key, value] of Object.entries(req.body)) {
      // Ne pas permettre la modification du rôle sauf pour les superviseurs et responsables
      if (key === 'role' && !['superviseur', 'responsable'].includes(req.user.role)) {
        continue;
      }
      // Ne pas mettre à jour le mot de passe ici
      if (key === 'password') {
        continue;
      }
      updateData[key] = value;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/users/:id
// @desc    Supprimer un utilisateur
// @access  Private (Superviseur, Responsable)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
