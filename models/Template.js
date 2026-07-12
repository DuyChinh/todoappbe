const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4, 5, 6] // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  },
  items: [
    {
      time: { type: String, required: true },
      content: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Template', TemplateSchema);
