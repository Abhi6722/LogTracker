const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/upload', authenticateToken, logController.uploadLogFile);
router.get('/', authenticateToken, logController.getLogFiles);
router.patch('/:id/toggle', authenticateToken, logController.toggleLogFile);
router.delete('/:id', authenticateToken, logController.deleteLogFile);

module.exports = router;