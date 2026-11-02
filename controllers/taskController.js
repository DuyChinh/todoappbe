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
      // Auto-generate from template
      const targetDate = parseISO(date);
      const dayOfWeek = getDay(targetDate); // 0 (Sun) - 6 (Sat)
      
      const template = await Template.findOne({ dayOfWeek });
      
      if (template && template.items.length > 0) {
        const newTasks = template.items.map(item => ({
          date: date,
          time: item.time,
          content: item.content,
          category: item.category || 'general',
          pomoSession: item.pomoSession || '',
          durationMinutes: item.durationMinutes || 25,
          isBreak: !!item.isBreak,
          notes: '',
          completed: false
        }));
        
        await Task.insertMany(newTasks);
        tasks = await Task.find({ date }).sort('time');
      }
    }
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by date:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách nhiệm vụ', error: error.message });
  }
};

// Toggle task completion
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    let { completed } = req.body;
    
    let task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy nhiệm vụ' });
    }
    
    if (completed === undefined) {
      completed = !task.completed;
    }

    task.completed = completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật trạng thái', error: error.message });
  }
};

// Create custom task
exports.createTask = async (req, res) => {
  try {
    const { date, time, content, category, pomoSession, durationMinutes, isBreak, notes } = req.body;
    
    if (!date || !time || !content) {
      return res.status(400).json({ message: 'Vui lòng điền đủ ngày, giờ và nội dung' });
    }

    const newTask = new Task({
      date,
      time,
      content,
      category: category || 'general',
      pomoSession: pomoSession || '',
      durationMinutes: durationMinutes || 25,
      isBreak: !!isBreak,
      notes: notes || '',
      completed: false
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo nhiệm vụ', error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const task = await Task.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy nhiệm vụ' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật nhiệm vụ', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy nhiệm vụ' });
    }
    res.json({ message: 'Đã xóa nhiệm vụ thành công' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa nhiệm vụ', error: error.message });
  }
};

// Reset and regenerate tasks for a date from template
exports.resetTasksForDate = async (req, res) => {
  try {
    const { date } = req.params;
    await Task.deleteMany({ date });
    
    const targetDate = parseISO(date);
    const dayOfWeek = getDay(targetDate);
    const template = await Template.findOne({ dayOfWeek });
    
    let tasks = [];
    if (template && template.items.length > 0) {
      const newTasks = template.items.map(item => ({
        date: date,
        time: item.time,
        content: item.content,
        category: item.category || 'general',
        pomoSession: item.pomoSession || '',
        durationMinutes: item.durationMinutes || 25,
        isBreak: !!item.isBreak,
        notes: '',
        completed: false
      }));
      await Task.insertMany(newTasks);
      tasks = await Task.find({ date }).sort('time');
    }

    res.json(tasks);
  } catch (error) {
    console.error('Error resetting tasks:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo lại lịch trình', error: error.message });
  }
};

// Get completion stats for the last 7 to 14 days
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    const stats = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = d.toISOString().split('T')[0];
      
      const tasks = await Task.find({ date: dateStr, isBreak: false });
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      
      stats.push({
        date: dateStr,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }

    // Overall summary
    const allFocusTasks = await Task.find({ isBreak: false });
    const allCompletedFocusTasks = allFocusTasks.filter(t => t.completed);
    const totalPomoCompleted = allCompletedFocusTasks.reduce((sum, t) => sum + (t.durationMinutes || 25), 0);

    res.json({
      dailyStats: stats,
      totalFocusTasks: allFocusTasks.length,
      totalCompletedTasks: allCompletedFocusTasks.length,
      totalFocusMinutes: totalPomoCompleted,
      completionRate: allFocusTasks.length > 0 ? Math.round((allCompletedFocusTasks.length / allFocusTasks.length) * 100) : 0
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thống kê', error: error.message });
  }
};
