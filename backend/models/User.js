
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing', 'superviseur', 'responsable'],
    default: 'client'
  },
  telephone: {
    type: String,
    default: ''
  },
  adresse: {
    type: String,
    default: ''
  },
  ville: {
    type: String,
    default: ''
  },
  codePostal: {
    type: String,
    default: ''
  },
  iban: {
    type: String,
    default: ''
  },
  bic: {
    type: String,
    default: ''
  },
  nomBanque: {
    type: String,
    default: ''
  },
  equipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  // Champs spécifiques pour les clients
  secteurActivite: {
    type: String,
    default: ''
  },
  typeEntreprise: {
    type: String,
    default: ''
  },
  besoins: {
    type: String,
    default: ''
  },
  // Champs spécifiques pour les agents
  statistiques: {
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
    }
  }
});

module.exports = mongoose.model('User', UserSchema);
