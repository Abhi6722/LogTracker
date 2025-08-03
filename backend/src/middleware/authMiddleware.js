const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Invalid access token' });
    }

    req.userId = user.id;
    req.user = user;
    req.projectId = req.headers['x-project-id'] || req.query.projectId;    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid access token' });
  }
};

exports.requireProject = async (req, res, next) => {
  if (!req.projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }
  
  try {
    const project = await global.prisma.project.findFirst({
      where: {
        id: req.projectId,
        ownerId: req.userId
      }
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error('Project access error:', error);
    return res.status(500).json({ message: 'Error verifying project access' });
  }
};

exports.rateLimiter = async (req, res, next) => {
  next();
};