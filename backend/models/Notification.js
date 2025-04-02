
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: "À l'instant"
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['success', 'info', 'warning'],
    default: 'info'
  },
  link: {
    type: String
  },
  action: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
