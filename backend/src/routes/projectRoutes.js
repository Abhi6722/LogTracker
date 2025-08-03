const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Project management routes
router.post('/', authenticateToken, projectController.createProject);
router.get('/', authenticateToken, projectController.getProjects);
router.patch('/:id', authenticateToken, projectController.updateProject);
router.post('/:id/regenerate-key', authenticateToken, projectController.regenerateApiKey);
router.delete('/:id', authenticateToken, projectController.deleteProject);

module.exports = router;