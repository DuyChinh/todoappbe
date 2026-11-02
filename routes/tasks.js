const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get tasks for a specific date
router.get('/date/:date', taskController.getTasksByDate);

// Toggle task completion
router.patch('/:id/toggle', taskController.toggleTaskCompletion);

// Create task
router.post('/', taskController.createTask);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

// Reset tasks for date to template
router.post('/reset/:date', taskController.resetTasksForDate);

// Get stats
router.get('/stats', taskController.getStats);

module.exports = router;
