const Task = require('../models/Task');
const Template = require('../models/Template');
const { parseISO, getDay, subDays } = require('date-fns');

// Auto-generate or fetch tasks for a specific date
exports.getTasksByDate = async (req, res) => {
  try {
    const { date } = req.params; // format YYYY-MM-DD
    
    // Check if tasks already exist for this date
    let tasks = await Task.find({ date }).sort('time');
    
    if (tasks.length === 0) {
      // Need to auto-generate
      const targetDate = parseISO(date);
      const dayOfWeek = getDay(targetDate); // 0 (Sun) - 6 (Sat)
      
      const template = await Template.findOne({ dayOfWeek });
      
      if (template && template.items.length > 0) {
        const newTasks = template.items.map(item => ({
          date: date,
          time: item.time,
          content: item.content,
          completed: false
        }));
        
        await Task.insertMany(newTasks);
        tasks = await Task.find({ date }).sort('time');
      }
    }
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle task completion
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get completion stats for the last 7 days
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    const stats = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = d.toISOString().split('T')[0];
      
      const tasks = await Task.find({ date: dateStr });
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      
      stats.push({
        date: dateStr,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
