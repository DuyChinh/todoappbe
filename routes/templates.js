const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const { getSeedTemplates } = require('../data/n2Templates');

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find().sort('dayOfWeek');
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách lịch mẫu', error: error.message });
  }
});

// Re-seed templates
router.post('/seed', async (req, res) => {
  try {
    const templates = getSeedTemplates();
    await Template.deleteMany({});
    await Template.insertMany(templates);
    const seeded = await Template.find().sort('dayOfWeek');
    res.json({ message: 'Đã nạp lại dữ liệu lịch mẫu JLPT N2 thành công!', templates: seeded });
  } catch (error) {
    console.error('Error seeding templates:', error);
    res.status(500).json({ message: 'Lỗi khi nạp dữ liệu mẫu', error: error.message });
  }
});

module.exports = router;
