const MockExam = require('../models/MockExam');

exports.getAllMockExams = async (req, res) => {
  try {
    const exams = await MockExam.find().sort({ date: -1, createdAt: -1 });
    res.json(exams);
  } catch (error) {
    console.error('Error fetching mock exams:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách điểm thi thử', error: error.message });
  }
};

exports.createMockExam = async (req, res) => {
  try {
    const { testName, date, vocabGrammarScore, readingScore, listeningScore, notes } = req.body;

    if (!testName || !date) {
      return res.status(400).json({ message: 'Tên đề thi và ngày thi là bắt buộc' });
    }

    const vg = Number(vocabGrammarScore) || 0;
    const rd = Number(readingScore) || 0;
    const ls = Number(listeningScore) || 0;
    const total = vg + rd + ls;
    const isFailedSection = vg < 19 || rd < 19 || ls < 19;
    const passed = !isFailedSection && total >= 90;

    const exam = new MockExam({
      testName,
      date,
      vocabGrammarScore: vg,
      readingScore: rd,
      listeningScore: ls,
      totalScore: total,
      isFailedSection,
      passed,
      notes: notes || ''
    });

    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating mock exam:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lưu kết quả thi thử', error: error.message });
  }
};

exports.updateMockExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { testName, date, vocabGrammarScore, readingScore, listeningScore, notes } = req.body;

    const exam = await MockExam.findById(id);
    if (!exam) {
      return res.status(404).json({ message: 'Không tìm thấy kết quả thi thử' });
    }

    if (testName !== undefined) exam.testName = testName;
    if (date !== undefined) exam.date = date;
    if (vocabGrammarScore !== undefined) exam.vocabGrammarScore = Number(vocabGrammarScore);
    if (readingScore !== undefined) exam.readingScore = Number(readingScore);
    if (listeningScore !== undefined) exam.listeningScore = Number(listeningScore);
    if (notes !== undefined) exam.notes = notes;

    exam.totalScore = exam.vocabGrammarScore + exam.readingScore + exam.listeningScore;
    exam.isFailedSection = exam.vocabGrammarScore < 19 || exam.readingScore < 19 || exam.listeningScore < 19;
    exam.passed = !exam.isFailedSection && exam.totalScore >= 90;

    await exam.save();
    res.json(exam);
  } catch (error) {
    console.error('Error updating mock exam:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật kết quả thi thử', error: error.message });
  }
};

exports.deleteMockExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await MockExam.findByIdAndDelete(id);
    if (!exam) {
      return res.status(404).json({ message: 'Không tìm thấy kết quả thi thử' });
    }
    res.json({ message: 'Đã xóa kết quả thi thử thành công' });
  } catch (error) {
    console.error('Error deleting mock exam:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa kết quả thi thử', error: error.message });
  }
};
