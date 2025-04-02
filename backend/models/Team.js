
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  fonction: {
    type: String,
    enum: ['phoning', 'visio', 'developpement', 'marketing', 'mixte'],
    required: true
  },
  description: {
    type: String
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', TeamSchema);
