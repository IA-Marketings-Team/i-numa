
const express = require('express');
const router = express.Router();
const Dossier = require('../models/Dossier');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/dossiers
// @desc    Obtenir tous les dossiers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let dossiers;
    
    // Filtrer les dossiers en fonction du rôle de l'utilisateur
    switch (req.user.role) {
      case 'client':
        dossiers = await Dossier.find({ clientId: req.user.id })
          .populate('clientId', 'nom prenom email telephone')
          .populate('agentPhonerId', 'nom prenom')
          .populate('agentVisioId', 'nom prenom')
          .populate('offres')
          .sort({ dateCreation: -1 });
        break;
      case 'agent_phoner':
        dossiers = await Dossier.find({ 
          agentPhonerId: req.user.id,
          status: { $ne: 'archive' }
        })
          .populate('clientId', 'nom prenom email telephone')
          .populate('agentPhonerId', 'nom prenom')
          .populate('agentVisioId', 'nom prenom')
          .populate('offres')
          .sort({ dateCreation: -1 });
        break;
      case 'agent_visio':
        dossiers = await Dossier.find({ 
          agentVisioId: req.user.id,
          status: { $ne: 'archive' }
        })
          .populate('clientId', 'nom prenom email telephone')
          .populate('agentPhonerId', 'nom prenom')
          .populate('agentVisioId', 'nom prenom')
          .populate('offres')
          .sort({ dateCreation: -1 });
        break;
      case 'superviseur':
      case 'responsable':
        dossiers = await Dossier.find()
          .populate('clientId', 'nom prenom email telephone')
          .populate('agentPhonerId', 'nom prenom')
          .populate('agentVisioId', 'nom prenom')
          .populate('offres')
          .sort({ dateCreation: -1 });
        break;
      default:
        return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(dossiers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/dossiers/status/:status
// @desc    Obtenir les dossiers par statut
// @access  Private
router.get('/status/:status', auth, async (req, res) => {
  try {
    let query = { status: req.params.status };
    
    // Ajouter des filtres supplémentaires en fonction du rôle
    if (req.user.role === 'client') {
      query.clientId = req.user.id;
    } else if (req.user.role === 'agent_phoner') {
      query.agentPhonerId = req.user.id;
    } else if (req.user.role === 'agent_visio') {
      query.agentVisioId = req.user.id;
    }
    
    // Les superviseurs et responsables peuvent voir tous les dossiers

    const dossiers = await Dossier.find(query)
      .populate('clientId', 'nom prenom email telephone')
      .populate('agentPhonerId', 'nom prenom')
      .populate('agentVisioId', 'nom prenom')
      .populate('offres')
      .sort({ dateCreation: -1 });
    
    res.json(dossiers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/dossiers/:id
// @desc    Obtenir un dossier par son ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.id)
      .populate('clientId', 'nom prenom email telephone adresse ville codePostal')
      .populate('agentPhonerId', 'nom prenom')
      .populate('agentVisioId', 'nom prenom')
      .populate('offres');
    
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit d'accéder au dossier
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

    res.json(dossier);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/dossiers
// @desc    Créer un nouveau dossier
// @access  Private (Agents, Superviseur, Responsable)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['agent_phoner', 'agent_visio', 'superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { 
      clientId, 
      agentPhonerId, 
      agentVisioId, 
      status, 
      offres, 
      notes, 
      montant,
      dateRdv
    } = req.body;

    // Créer un nouveau dossier
    const nouveauDossier = new Dossier({
      clientId,
      agentPhonerId,
      agentVisioId,
      status,
      offres,
      notes,
      montant
    });

    if (dateRdv) {
      nouveauDossier.dateRdv = new Date(dateRdv);
    }

    const dossier = await nouveauDossier.save();
    
    // Récupérer le dossier avec les relations
    const dossierComplet = await Dossier.findById(dossier._id)
      .populate('clientId', 'nom prenom email telephone')
      .populate('agentPhonerId', 'nom prenom')
      .populate('agentVisioId', 'nom prenom')
      .populate('offres');
    
    res.json(dossierComplet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/dossiers/:id
// @desc    Mettre à jour un dossier
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.id);
    
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit de modifier le dossier
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

    // Filtrer les champs à mettre à jour
    const updateData = {};
    for (const [key, value] of Object.entries(req.body)) {
      // Restrictions pour les agents
      if (['agent_phoner', 'agent_visio'].includes(req.user.role) && 
          ['montant', 'clientId'].includes(key)) {
        continue;
      }
      updateData[key] = value;
    }

    // Mise à jour des dates en fonction du statut
    if (req.body.status && req.body.status !== dossier.status) {
      const now = new Date();
      
      switch (req.body.status) {
        case 'rdv_en_cours':
          if (!updateData.dateRdv) updateData.dateRdv = now;
          break;
        case 'valide':
          updateData.dateValidation = now;
          break;
        case 'signe':
          updateData.dateSignature = now;
          break;
        case 'archive':
          updateData.dateArchivage = now;
          break;
      }
    }

    // Toujours mettre à jour la date de mise à jour
    updateData.dateMiseAJour = new Date();

    const dossierMisAJour = await Dossier.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
      .populate('clientId', 'nom prenom email telephone')
      .populate('agentPhonerId', 'nom prenom')
      .populate('agentVisioId', 'nom prenom')
      .populate('offres');

    res.json(dossierMisAJour);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/dossiers/:id
// @desc    Supprimer un dossier
// @access  Private (Superviseur, Responsable)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const dossier = await Dossier.findById(req.params.id);
    
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    await Dossier.findByIdAndDelete(req.params.id);

    res.json({ message: 'Dossier supprimé' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
