const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, settings } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.userId,
        apiKey: crypto.randomBytes(32).toString('hex'),
        settings: settings || {
          logLevels: ['error', 'warn', 'info', 'debug'],
          retentionDays: 30,
          maxLogsPerMinute: 1000
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
};

// Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const projects = await prisma.project.findMany({
      where: { ownerId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Update project settings
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, settings } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name || project.name,
        description: description || project.description,
        settings: settings ? { ...project.settings, ...settings } : project.settings
      }
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

// Regenerate API key
exports.regenerateApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        apiKey: crypto.randomBytes(32).toString('hex')
      }
    });
    
    res.json({ apiKey: updatedProject.apiKey });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    res.status(500).json({ message: 'Error regenerating API key' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};