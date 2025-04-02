
const mongoose = require('mongoose');

const DossierSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agentPhonerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  agentVisioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['prospect', 'rdv_en_cours', 'valide', 'signe', 'archive'],
    default: 'prospect'
  },
  offres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offre'
  }],
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateMiseAJour: {
    type: Date,
    default: Date.now
  },
  dateRdv: {
    type: Date
  },
  dateValidation: {
    type: Date
  },
  dateSignature: {
    type: Date
  },
  dateArchivage: {
    type: Date
  },
  notes: {
    type: String
  },
  montant: {
    type: Number
  }
});

module.exports = mongoose.model('Dossier', DossierSchema);
