const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Upload logs directly
exports.uploadLogs = async (req, res) => {
  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ message: 'Logs array is required' });
    }

    // Create logs directly
    const createdLogs = await prisma.log.createMany({
      data: logs.map(log => ({
        level: log.level,
        message: log.message,
        timestamp: new Date(log.timestamp),
        source: log.source,
        requestId: log.requestId,
        headers: log.headers,
        method: log.method,
        query: log.query,
        url: log.url,
        metadata: log.metadata,
        projectId: req.projectId,
        userId: req.userId
      }))
    });

    // Update log stats
    await updateLogStats(req.projectId);

    // Emit real-time log updates to connected clients
    if (global.io) {
      global.io.to(`project:${req.projectId}`).emit('new-logs', {
        logs: logs,
        count: createdLogs.count,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      message: 'Logs uploaded successfully',
      count: createdLogs.count
    });
  } catch (error) {
    console.error('Error uploading logs:', error);
    res.status(500).json({ message: 'Error uploading logs' });
  }
};

// Upload logs via API key (for external integrations)
exports.uploadLogsWithApiKey = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ message: 'API key is required' });
    }

    const project = await prisma.project.findFirst({
      where: { 
        apiKey,
        enabled: true
      }
    });

    if (!project) {
      return res.status(401).json({ message: 'Invalid or disabled API key' });
    }

    const { logs } = req.body;
    
    if (!Array.isArray(logs)) {
      return res.status(400).json({ message: 'Logs must be an array' });
    }

    const settings = project.settings;
    if (logs.length > settings.maxLogsPerMinute) {
      return res.status(429).json({ 
        message: `Exceeded maximum logs per minute (${settings.maxLogsPerMinute})`
      });
    }

    const invalidLogs = logs.filter(log => 
      !settings.logLevels.includes(log.level?.toLowerCase())
    );
    
    if (invalidLogs.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid log levels detected',
        invalidLogs: invalidLogs.map(log => log.level)
      });
    }

    // Create logs directly
    const createdLogs = await prisma.log.createMany({
      data: logs.map(log => ({
        level: log.level,
        message: log.message,
        timestamp: new Date(log.timestamp),
        source: log.source,
        requestId: log.requestId,
        headers: log.headers,
        method: log.method,
        query: log.query,
        url: log.url,
        metadata: log.metadata,
        projectId: project.id,
        userId: project.ownerId
      }))
    });

    // Update log stats
    await updateLogStats(project.id);

    // Emit real-time log updates
    if (global.io) {
      global.io.to(`project:${project.id}`).emit('new-logs', {
        logs: logs,
        count: createdLogs.count,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      message: 'Logs uploaded successfully',
      count: createdLogs.count
    });
  } catch (error) {
    console.error('Error uploading logs:', error);
    res.status(500).json({ message: 'Error uploading logs' });
  }
};

// Get logs with pagination and filters
exports.getLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      level, 
      source, 
      startDate, 
      endDate,
      search 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = {
      projectId: req.projectId
    };

    if (level) {
      whereClause.level = level;
    }

    if (source) {
      whereClause.source = source;
    }

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = new Date(startDate);
      if (endDate) whereClause.timestamp.lte = new Date(endDate);
    }

    if (search) {
      whereClause.message = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where: whereClause,
        orderBy: {
          timestamp: 'desc'
        },
        skip,
        take: parseInt(limit),
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.log.count({
        where: whereClause
      })
    ]);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
};

// Get log statistics
exports.getLogStats = async (req, res) => {
  try {
    const stats = await prisma.logStats.findUnique({
      where: {
        projectId: req.projectId
      }
    });

    if (!stats) {
      // Create stats if they don't exist
      const newStats = await updateLogStats(req.projectId);
      res.json(newStats);
    } else {
      res.json(stats);
    }
  } catch (error) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({ message: 'Error fetching log stats' });
  }
};

// Get real-time log stream
exports.getLogStream = async (req, res) => {
  try {
    const { limit = 50, level, source } = req.query;
    
    const whereClause = {
      projectId: req.projectId
    };

    if (level) {
      whereClause.level = level;
    }

    if (source) {
      whereClause.source = source;
    }

    const logs = await prisma.log.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: parseInt(limit)
    });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching log stream:', error);
    res.status(500).json({ message: 'Error fetching log stream' });
  }
};

// Delete logs
exports.deleteLogs = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Log IDs array is required' });
    }

    const result = await prisma.log.deleteMany({
      where: {
        id: {
          in: ids
        },
        projectId: req.projectId
      }
    });

    // Update log stats
    await updateLogStats(req.projectId);

    res.json({ 
      message: 'Logs deleted successfully',
      count: result.count
    });
  } catch (error) {
    console.error('Error deleting logs:', error);
    res.status(500).json({ message: 'Error deleting logs' });
  }
};

// Helper function to update log stats
async function updateLogStats(projectId) {
  const stats = await prisma.log.groupBy({
    by: ['level'],
    where: { projectId },
    _count: {
      level: true
    }
  });

  const statsMap = {
    error: 0,
    warn: 0,
    info: 0,
    debug: 0
  };

  stats.forEach(stat => {
    const level = stat.level.toLowerCase();
    if (statsMap.hasOwnProperty(level)) {
      statsMap[level] = stat._count.level;
    }
  });

  const totalCount = Object.values(statsMap).reduce((a, b) => a + b, 0);

  return await prisma.logStats.upsert({
    where: { projectId },
    update: {
      errorCount: statsMap.error,
      warnCount: statsMap.warn,
      infoCount: statsMap.info,
      debugCount: statsMap.debug,
      totalCount,
      lastUpdated: new Date()
    },
    create: {
      projectId,
      errorCount: statsMap.error,
      warnCount: statsMap.warn,
      infoCount: statsMap.info,
      debugCount: statsMap.debug,
      totalCount
    }
  });
}