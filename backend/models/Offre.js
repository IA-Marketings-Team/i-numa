
const mongoose = require('mongoose');

const OffreSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['SEO', 'Google Ads', 'Email X', 'Foner', 'Devis'],
    required: true
  },
  prix: {
    type: Number
  }
});

module.exports = mongoose.model('Offre', OffreSchema);
