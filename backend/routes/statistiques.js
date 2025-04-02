
const express = require('express');
const router = express.Router();
const Statistique = require('../models/Statistique');
const User = require('../models/User');
const Dossier = require('../models/Dossier');
const auth = require('../middleware/auth');

// @route   GET api/statistiques
// @desc    Obtenir toutes les statistiques
// @access  Private (Superviseur, Responsable)
router.get('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const statistiques = await Statistique.find()
      .sort({ dateDebut: -1 });
    
    res.json(statistiques);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/statistiques/periode/:periode
// @desc    Obtenir les statistiques par période (jour, semaine, mois)
// @access  Private (Superviseur, Responsable)
router.get('/periode/:periode', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Valider la période
    const periode = req.params.periode;
    if (!['jour', 'semaine', 'mois'].includes(periode)) {
      return res.status(400).json({ message: 'Période non valide' });
    }

    const statistiques = await Statistique.find({ periode })
      .sort({ dateDebut: -1 });
    
    res.json(statistiques);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/statistiques/intervalle
// @desc    Obtenir les statistiques entre deux dates
// @access  Private (Superviseur, Responsable)
router.get('/intervalle', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { debut, fin } = req.query;
    
    if (!debut || !fin) {
      return res.status(400).json({ message: 'Les dates de début et de fin sont requises' });
    }

    const dateDebut = new Date(debut);
    const dateFin = new Date(fin);

    const statistiques = await Statistique.find({
      dateDebut: { $gte: dateDebut },
      dateFin: { $lte: dateFin }
    }).sort({ dateDebut: -1 });
    
    res.json(statistiques);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/statistiques
// @desc    Créer de nouvelles statistiques
// @access  Private (Superviseur, Responsable)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { 
      periode, 
      dateDebut, 
      dateFin, 
      appelsEmis, 
      appelsDecroches, 
      appelsTransformes,
      rendezVousHonores,
      rendezVousNonHonores,
      dossiersValides,
      dossiersSigne,
      chiffreAffaires
    } = req.body;

    // Créer de nouvelles statistiques
    const nouvellesStatistiques = new Statistique({
      periode,
      dateDebut: new Date(dateDebut),
      dateFin: new Date(dateFin),
      appelsEmis,
      appelsDecroches,
      appelsTransformes,
      rendezVousHonores,
      rendezVousNonHonores,
      dossiersValides,
      dossiersSigne,
      chiffreAffaires
    });

    const statistiques = await nouvellesStatistiques.save();
    
    res.json(statistiques);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/statistiques/generer
// @desc    Générer automatiquement les statistiques
// @access  Private (Superviseur, Responsable)
router.post('/generer', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // 1. Récupérer les données des agents (statistiques individuelles)
    const agents = await User.find({
      role: { $in: ['agent_phoner', 'agent_visio'] }
    });
    
    if (!agents || agents.length === 0) {
      return res.status(404).json({ message: 'Aucun agent trouvé' });
    }
    
    // 2. Agréger les données
    const stats = agents.reduce((acc, agent) => {
      acc.appelsEmis += agent.statistiques.appelsEmis || 0;
      acc.appelsDecroches += agent.statistiques.appelsDecroches || 0;
      acc.appelsTransformes += agent.statistiques.appelsTransformes || 0;
      acc.rendezVousHonores += agent.statistiques.rendezVousHonores || 0;
      acc.rendezVousNonHonores += agent.statistiques.rendezVousNonHonores || 0;
      acc.dossiersValides += agent.statistiques.dossiersValides || 0;
      acc.dossiersSigne += agent.statistiques.dossiersSigne || 0;
      return acc;
    }, {
      appelsEmis: 0,
      appelsDecroches: 0,
      appelsTransformes: 0,
      rendezVousHonores: 0,
      rendezVousNonHonores: 0,
      dossiersValides: 0,
      dossiersSigne: 0
    });
    
    // 3. Calculer le chiffre d'affaires
    const dossiers = await Dossier.find({ status: 'signe' });
    const chiffreAffaires = dossiers.reduce((sum, dossier) => sum + (dossier.montant || 0), 0);
    
    // 4. Créer les statistiques pour aujourd'hui
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nouvellesStatistiques = new Statistique({
      periode: 'jour',
      dateDebut: today,
      dateFin: tomorrow,
      appelsEmis: stats.appelsEmis,
      appelsDecroches: stats.appelsDecroches,
      appelsTransformes: stats.appelsTransformes,
      rendezVousHonores: stats.rendezVousHonores,
      rendezVousNonHonores: stats.rendezVousNonHonores,
      dossiersValides: stats.dossiersValides,
      dossiersSigne: stats.dossiersSigne,
      chiffreAffaires
    });

    const statistiques = await nouvellesStatistiques.save();
    
    res.json({
      message: 'Statistiques générées avec succès',
      statistiques
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/statistiques/:id
// @desc    Mettre à jour des statistiques
// @access  Private (Superviseur, Responsable)
router.put('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const statistique = await Statistique.findById(req.params.id);
    
    if (!statistique) {
      return res.status(404).json({ message: 'Statistiques non trouvées' });
    }

    const updateData = {};
    for (const [key, value] of Object.entries(req.body)) {
      updateData[key] = value;
    }
    
    // Gestion spéciale pour les dates
    if (updateData.dateDebut) {
      updateData.dateDebut = new Date(updateData.dateDebut);
    }
    if (updateData.dateFin) {
      updateData.dateFin = new Date(updateData.dateFin);
    }

    const statistiqueMiseAJour = await Statistique.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json(statistiqueMiseAJour);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Statistiques non trouvées' });
    }
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/statistiques/:id
// @desc    Supprimer des statistiques
// @access  Private (Superviseur, Responsable)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur a les droits appropriés
    if (!['superviseur', 'responsable'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const statistique = await Statistique.findById(req.params.id);
    
    if (!statistique) {
      return res.status(404).json({ message: 'Statistiques non trouvées' });
    }

    await Statistique.findByIdAndDelete(req.params.id);

    res.json({ message: 'Statistiques supprimées' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Statistiques non trouvées' });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
