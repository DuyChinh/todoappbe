const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find().sort('dayOfWeek');
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
