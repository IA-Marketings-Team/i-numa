
const mongoose = require('mongoose');

const StatistiqueSchema = new mongoose.Schema({
  periode: {
    type: String,
    enum: ['jour', 'semaine', 'mois'],
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  appelsEmis: {
    type: Number,
    default: 0
  },
  appelsDecroches: {
    type: Number,
    default: 0
  },
  appelsTransformes: {
    type: Number,
    default: 0
  },
  rendezVousHonores: {
    type: Number,
    default: 0
  },
  rendezVousNonHonores: {
    type: Number,
    default: 0
  },
  dossiersValides: {
    type: Number,
    default: 0
  },
  dossiersSigne: {
    type: Number,
    default: 0
  },
  chiffreAffaires: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Statistique', StatistiqueSchema);
