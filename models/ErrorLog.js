const mongoose = require('mongoose');

const ErrorLogSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    trim: true
  },
  meaning: {
    type: String,
    required: true,
    trim: true
  },
  exampleOrNote: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    enum: ['vocab', 'kanji', 'grammar', 'reading', 'listening', 'other'],
    default: 'vocab'
  },
  reviewedMorning: {
    type: Boolean,
    default: false
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ErrorLog', ErrorLogSchema);
