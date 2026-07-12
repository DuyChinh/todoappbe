const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get tasks for a specific date
router.get('/date/:date', taskController.getTasksByDate);

// Toggle task completion
router.patch('/:id/toggle', taskController.toggleTaskCompletion);

// Get 7-day stats
router.get('/stats', taskController.getStats);

module.exports = router;
