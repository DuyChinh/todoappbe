const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  time: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  pomoSession: {
    type: String,
    default: ''
  },
  durationMinutes: {
    type: Number,
    default: 25
  },
  isBreak: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
