const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4, 5, 6] // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  },
  dayLabel: {
    type: String,
    default: ''
  },
  items: [
    {
      time: { type: String, required: true },
      content: { type: String, required: true },
      pomoSession: { type: String, default: '' },
      durationMinutes: { type: Number, default: 25 },
      category: { type: String, default: 'general' },
      isBreak: { type: Boolean, default: false }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Template', TemplateSchema);
