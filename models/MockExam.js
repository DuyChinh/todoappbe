const mongoose = require('mongoose');

const MockExamSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  vocabGrammarScore: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  readingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  listeningScore: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 180
  },
  passed: {
    type: Boolean,
    default: false
  },
  isFailedSection: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Auto calculate total and pass status before saving
MockExamSchema.pre('save', function () {
  this.totalScore = (this.vocabGrammarScore || 0) + (this.readingScore || 0) + (this.listeningScore || 0);
  const hasFailedSection = (this.vocabGrammarScore < 19) || (this.readingScore < 19) || (this.listeningScore < 19);
  this.isFailedSection = hasFailedSection;
  this.passed = !hasFailedSection && (this.totalScore >= 90);
});

module.exports = mongoose.model('MockExam', MockExamSchema);
