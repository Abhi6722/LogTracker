const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { requireProject, authenticateToken } = require('../middleware/authMiddleware');

// Routes that need authentication and project ID
router.post('/upload', authenticateToken, requireProject, logController.uploadLogs);
router.get('/', authenticateToken, requireProject, logController.getLogs);
router.get('/stats', authenticateToken, requireProject, logController.getLogStats);
router.get('/stream', authenticateToken, requireProject, logController.getLogStream);
router.delete('/', authenticateToken, requireProject, logController.deleteLogs);

// Routes that use API key (no authentication middleware needed)
router.post('/upload-with-key', logController.uploadLogsWithApiKey);

module.exports = router;