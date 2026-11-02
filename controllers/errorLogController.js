const ErrorLog = require('../models/ErrorLog');

exports.getAllErrorLogs = async (req, res) => {
  try {
    const { category, reviewedMorning, search } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (reviewedMorning !== undefined && reviewedMorning !== '') {
      filter.reviewedMorning = reviewedMorning === 'true';
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { term: regex },
        { meaning: regex },
        { exampleOrNote: regex }
      ];
    }

    const logs = await ErrorLog.find(filter).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching error logs:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy sổ tay lỗi sai', error: error.message });
  }
};

exports.createErrorLog = async (req, res) => {
  try {
    const { term, meaning, exampleOrNote, category, date } = req.body;

    if (!term || !meaning) {
      return res.status(400).json({ message: 'Vui lòng nhập từ/ngữ pháp và ý nghĩa/lời giải' });
    }

    const todayStr = date || new Date().toISOString().split('T')[0];

    const errorLog = new ErrorLog({
      term,
      meaning,
      exampleOrNote: exampleOrNote || '',
      category: category || 'vocab',
      reviewedMorning: false,
      date: todayStr
    });

    await errorLog.save();
    res.status(201).json(errorLog);
  } catch (error) {
    console.error('Error creating error log:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lưu vào sổ tay lỗi sai', error: error.message });
  }
};

exports.toggleReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { reviewedMorning } = req.body;

    const log = await ErrorLog.findById(id);
    if (!log) {
      return res.status(404).json({ message: 'Không tìm thấy mục ghi chú' });
    }

    if (reviewedMorning === undefined) {
      reviewedMorning = !log.reviewedMorning;
    }

    log.reviewedMorning = reviewedMorning;
    await log.save();
    res.json(log);
  } catch (error) {
    console.error('Error toggling review status:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật trạng thái ôn tập', error: error.message });
  }
};

exports.updateErrorLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { term, meaning, exampleOrNote, category, reviewedMorning } = req.body;

    const log = await ErrorLog.findById(id);
    if (!log) {
      return res.status(404).json({ message: 'Không tìm thấy mục ghi chú' });
    }

    if (term !== undefined) log.term = term;
    if (meaning !== undefined) log.meaning = meaning;
    if (exampleOrNote !== undefined) log.exampleOrNote = exampleOrNote;
    if (category !== undefined) log.category = category;
    if (reviewedMorning !== undefined) log.reviewedMorning = reviewedMorning;

    await log.save();
    res.json(log);
  } catch (error) {
    console.error('Error updating error log:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật ghi chú', error: error.message });
  }
};

exports.deleteErrorLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await ErrorLog.findByIdAndDelete(id);
    if (!log) {
      return res.status(404).json({ message: 'Không tìm thấy mục ghi chú' });
    }
    res.json({ message: 'Đã xóa mục ghi chú thành công' });
  } catch (error) {
    console.error('Error deleting error log:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa ghi chú', error: error.message });
  }
};
