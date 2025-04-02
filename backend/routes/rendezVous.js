
const express = require('express');
const router = express.Router();
const RendezVous = require('../models/RendezVous');
const Dossier = require('../models/Dossier');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/rendez-vous
// @desc    Obtenir tous les rendez-vous
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Filtrer les rendez-vous en fonction du rôle de l'utilisateur
    if (req.user.role === 'client') {
      // Récupérer les dossiers du client
      const dossiers = await Dossier.find({ clientId: req.user.id }).select('_id');
      const dossierIds = dossiers.map(d => d._id);
      query.dossierId = { $in: dossierIds };
    } else if (req.user.role === 'agent_phoner' || req.user.role === 'agent_visio') {
      // Récupérer les dossiers de l'agent
      const field = req.user.role === 'agent_phoner' ? 'agentPhonerId' : 'agentVisioId';
      const dossiers = await Dossier.find({ [field]: req.user.id }).select('_id');
      const dossierIds = dossiers.map(d => d._id);
      query.dossierId = { $in: dossierIds };
    }
    // Les superviseurs et responsables peuvent voir tous les rendez-vous
    
    const rendezVous = await RendezVous.find(query)
      .populate({
        path: 'dossierId',
        populate: [
          { path: 'clientId', select: 'nom prenom email telephone' },
          { path: 'agentPhonerId', select: 'nom prenom' },
          { path: 'agentVisioId', select: 'nom prenom' }
        ]
      })
      .sort({ date: -1 });
    
    res.json(rendezVous);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/rendez-vous/dossier/:dossierId
// @desc    Obtenir les rendez-vous pour un dossier spécifique
// @access  Private
router.get('/dossier/:dossierId', auth, async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.dossierId);
    
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit d'accéder au dossier
    if (req.user.role === 'client' && dossier.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (req.user.role === 'agent_phoner' && 
        dossier.agentPhonerId && 
        dossier.agentPhonerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (req.user.role === 'agent_visio' && 
        dossier.agentVisioId && 
        dossier.agentVisioId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const rendezVous = await RendezVous.find({ dossierId: req.params.dossierId })
      .populate({
        path: 'dossierId',
        populate: [
          { path: 'clientId', select: 'nom prenom email telephone' },
          { path: 'agentPhonerId', select: 'nom prenom' },
          { path: 'agentVisioId', select: 'nom prenom' }
        ]
      })
      .sort({ date: -1 });
    
    res.json(rendezVous);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/rendez-vous/:id
// @desc    Obtenir un rendez-vous par son ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const rendezVous = await RendezVous.findById(req.params.id)
      .populate({
        path: 'dossierId',
        populate: [
          { path: 'clientId', select: 'nom prenom email telephone adresse ville codePostal' },
          { path: 'agentPhonerId', select: 'nom prenom' },
          { path: 'agentVisioId', select: 'nom prenom' }
        ]
      });
    
    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit d'accéder au rendez-vous
    const dossier = rendezVous.dossierId;
    
    if (req.user.role === 'client' && dossier.clientId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (req.user.role === 'agent_phoner' && 
        dossier.agentPhonerId && 
        dossier.agentPhonerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (req.user.role === 'agent_visio' && 
        dossier.agentVisioId && 
        dossier.agentVisioId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(rendezVous);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/rendez-vous
// @desc    Créer un nouveau rendez-vous
// @access  Private (Agents, Superviseur, Responsable)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['agent_phoner', 'agent_visio', 'superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { dossierId, date, honore, notes, meetingLink, location } = req.body;

    // Vérifier si le dossier existe
    const dossier = await Dossier.findById(dossierId);
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    // Vérifier les permissions spécifiques pour les agents
    if (req.user.role === 'agent_phoner' && 
        dossier.agentPhonerId && 
        dossier.agentPhonerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (req.user.role === 'agent_visio' && 
        dossier.agentVisioId && 
        dossier.agentVisioId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Créer un nouveau rendez-vous
    const nouveauRendezVous = new RendezVous({
      dossierId,
      date: new Date(date),
      honore,
      notes,
      meetingLink,
      location
    });

    const rendezVous = await nouveauRendezVous.save();
    
    // Mettre à jour le statut du dossier si nécessaire
    if (dossier.status === 'prospect') {
      await Dossier.findByIdAndUpdate(dossierId, {
        status: 'rdv_en_cours',
        dateRdv: new Date(date),
        dateMiseAJour: new Date()
      });
    }

    // Récupérer le rendez-vous complet avec les relations
    const rendezVousComplet = await RendezVous.findById(rendezVous._id)
      .populate({
        path: 'dossierId',
        populate: [
          { path: 'clientId', select: 'nom prenom email telephone' },
          { path: 'agentPhonerId', select: 'nom prenom' },
          { path: 'agentVisioId', select: 'nom prenom' }
        ]
      });
    
    res.json(rendezVousComplet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/rendez-vous/:id
// @desc    Mettre à jour un rendez-vous
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const rendezVous = await RendezVous.findById(req.params.id);
    
    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier les permissions
    const dossier = await Dossier.findById(rendezVous.dossierId);
    
    if (req.user.role === 'client') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (req.user.role === 'agent_phoner' && 
        dossier.agentPhonerId && 
        dossier.agentPhonerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (req.user.role === 'agent_visio' && 
        dossier.agentVisioId && 
        dossier.agentVisioId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { date, honore, notes, meetingLink, location } = req.body;
    
    // Mettre à jour les champs
    if (date !== undefined) rendezVous.date = new Date(date);
    if (honore !== undefined) rendezVous.honore = honore;
    if (notes !== undefined) rendezVous.notes = notes;
    if (meetingLink !== undefined) rendezVous.meetingLink = meetingLink;
    if (location !== undefined) rendezVous.location = location;

    // Si le statut "honore" a été modifié, mettre à jour les statistiques de l'agent
    if (honore !== undefined && honore !== rendezVous.honore) {
      const agent = dossier.agentPhonerId 
        ? await User.findById(dossier.agentPhonerId) 
        : null;
      
      if (agent) {
        // Mise à jour des statistiques basée sur la nouvelle valeur de "honore"
        if (honore) {
          agent.statistiques.rendezVousHonores += 1;
          if (agent.statistiques.rendezVousNonHonores > 0) {
            agent.statistiques.rendezVousNonHonores -= 1;
          }
        } else {
          agent.statistiques.rendezVousNonHonores += 1;
          if (agent.statistiques.rendezVousHonores > 0) {
            agent.statistiques.rendezVousHonores -= 1;
          }
        }
        
        await agent.save();
      }
    }

    await rendezVous.save();

    // Récupérer le rendez-vous mis à jour avec les relations
    const rendezVousMisAJour = await RendezVous.findById(req.params.id)
      .populate({
        path: 'dossierId',
        populate: [
          { path: 'clientId', select: 'nom prenom email telephone' },
          { path: 'agentPhonerId', select: 'nom prenom' },
          { path: 'agentVisioId', select: 'nom prenom' }
        ]
      });

    res.json(rendezVousMisAJour);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/rendez-vous/:id
// @desc    Supprimer un rendez-vous
// @access  Private (Superviseur, Responsable)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const rendezVous = await RendezVous.findById(req.params.id);
    
    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    await RendezVous.findByIdAndDelete(req.params.id);

    res.json({ message: 'Rendez-vous supprimé' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
