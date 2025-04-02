
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['to_do', 'in_progress', 'done'],
    default: 'to_do'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateEcheance: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

module.exports = mongoose.model('Task', TaskSchema);
