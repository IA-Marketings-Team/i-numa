
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   GET api/notifications
// @desc    Obtenir toutes les notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Si l'utilisateur n'est pas admin, ne montrer que ses notifications et les notifications générales
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      query = { 
        $or: [
          { userId: req.user.id },
          { userId: null }
        ]
      };
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/notifications/unread
// @desc    Obtenir les notifications non lues
// @access  Private
router.get('/unread', auth, async (req, res) => {
  try {
    let query = { read: false };
    
    // Si l'utilisateur n'est pas admin, ne montrer que ses notifications et les notifications générales
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      query = { 
        $and: [
          { read: false },
          { $or: [
            { userId: req.user.id },
            { userId: null }
          ] }
        ]
      };
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/notifications
// @desc    Créer une nouvelle notification
// @access  Private (Superviseur, Responsable)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { title, description, time, type, link, action, userId } = req.body;

    // Créer une nouvelle notification
    const nouvelleNotification = new Notification({
      title,
      description,
      time: time || "À l'instant",
      type: type || 'info',
      link,
      action,
      userId
    });

    const notification = await nouvelleNotification.save();
    
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/notifications/read/:id
// @desc    Marquer une notification comme lue
// @access  Private
router.put('/read/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    // Vérifier si l'utilisateur a le droit de modifier cette notification
    if (notification.userId && 
        notification.userId.toString() !== req.user.id && 
        !['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/notifications/read-all
// @desc    Marquer toutes les notifications comme lues
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    let query = { read: false };
    
    // Si l'utilisateur n'est pas admin, ne marquer que ses notifications et les notifications générales
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      query = { 
        $and: [
          { read: false },
          { $or: [
            { userId: req.user.id },
            { userId: null }
          ] }
        ]
      };
    }
    
    await Notification.updateMany(query, { $set: { read: true } });

    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/notifications/:id
// @desc    Supprimer une notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    // Vérifier si l'utilisateur a le droit de supprimer cette notification
    if (notification.userId && 
        notification.userId.toString() !== req.user.id && 
        !['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification supprimée' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
