
const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
  dossierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dossier',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  honore: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  },
  meetingLink: {
    type: String
  },
  location: {
    type: String
  }
});

module.exports = mongoose.model('RendezVous', RendezVousSchema);
