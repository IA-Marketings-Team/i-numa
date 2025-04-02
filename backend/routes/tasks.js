
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// @route   GET api/tasks
// @desc    Obtenir toutes les tâches
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    
    // Filtrer les tâches en fonction du rôle de l'utilisateur
    if (['agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing'].includes(req.user.role)) {
      // Les agents ne voient que leurs propres tâches
      tasks = await Task.find({ agentId: req.user.id })
        .populate('agentId', 'nom prenom')
        .sort({ dateEcheance: 1 });
    } else if (['superviseur', 'responsable'].includes(req.user.role)) {
      // Les superviseurs et responsables voient toutes les tâches
      tasks = await Task.find()
        .populate('agentId', 'nom prenom')
        .sort({ dateEcheance: 1 });
    } else {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/tasks/agent/:agentId
// @desc    Obtenir les tâches par agent
// @access  Private (Superviseur, Responsable)
router.get('/agent/:agentId', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role) && 
        req.user.id !== req.params.agentId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const tasks = await Task.find({ agentId: req.params.agentId })
      .populate('agentId', 'nom prenom')
      .sort({ dateEcheance: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/tasks/:id
// @desc    Obtenir une tâche par son ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('agentId', 'nom prenom');
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier si l'utilisateur a le droit d'accéder à la tâche
    if (!['superviseur', 'responsable'].includes(req.user.role) && 
        task.agentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/tasks
// @desc    Créer une nouvelle tâche
// @access  Private (Superviseur, Responsable)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { title, description, agentId, status, dateEcheance, priority } = req.body;

    // Créer une nouvelle tâche
    const nouvelleTask = new Task({
      title,
      description,
      agentId,
      status,
      priority
    });

    if (dateEcheance) {
      nouvelleTask.dateEcheance = new Date(dateEcheance);
    }

    const task = await nouvelleTask.save();
    
    // Récupérer la tâche avec les relations
    const taskComplete = await Task.findById(task._id)
      .populate('agentId', 'nom prenom');
    
    res.json(taskComplete);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/tasks/:id
// @desc    Mettre à jour une tâche
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier si l'utilisateur a le droit de modifier la tâche
    if (!['superviseur', 'responsable'].includes(req.user.role) && 
        task.agentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Les agents ne peuvent modifier que le statut de leurs propres tâches
    if (['agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing'].includes(req.user.role)) {
      if (req.body.status !== undefined) {
        task.status = req.body.status;
      }
    } else {
      // Les superviseurs et responsables peuvent tout modifier
      const { title, description, agentId, status, dateEcheance, priority } = req.body;
      
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (agentId !== undefined) task.agentId = agentId;
      if (status !== undefined) task.status = status;
      if (dateEcheance !== undefined) task.dateEcheance = new Date(dateEcheance);
      if (priority !== undefined) task.priority = priority;
    }

    await task.save();

    // Récupérer la tâche mise à jour avec les relations
    const taskMiseAJour = await Task.findById(req.params.id)
      .populate('agentId', 'nom prenom');

    res.json(taskMiseAJour);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Supprimer une tâche
// @access  Private (Superviseur, Responsable)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
