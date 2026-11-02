const express = require('express');
const router = express.Router();
const mockExamController = require('../controllers/mockExamController');

router.get('/', mockExamController.getAllMockExams);
router.post('/', mockExamController.createMockExam);
router.put('/:id', mockExamController.updateMockExam);
router.delete('/:id', mockExamController.deleteMockExam);

module.exports = router;

