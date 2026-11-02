const express = require('express');
const router = express.Router();
const errorLogController = require('../controllers/errorLogController');

router.get('/', errorLogController.getAllErrorLogs);
router.post('/', errorLogController.createErrorLog);
router.patch('/:id/toggle-review', errorLogController.toggleReviewStatus);
router.put('/:id', errorLogController.updateErrorLog);
router.delete('/:id', errorLogController.deleteErrorLog);

module.exports = router;
