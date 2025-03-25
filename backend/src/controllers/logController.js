const LogFile = require('../models/LogFile');

exports.uploadLogFile = async (req, res) => {
  try {
    const { name, size, logs } = req.body;
    
    // Create a new log file document
    const logFile = new LogFile({
      name,
      size,
      uploadedBy: req.userId, // Updated to use req.userId
      logs: logs.map(log => ({
        level: log.level,
        message: log.message,
        timestamp: new Date(log.timestamp),
        source: log.source,
        requestId: log.requestId,
        headers: log.headers,
        method: log.method,
        query: log.query,
        url: log.url
      }))
    });

    await logFile.save();
    res.status(201).json(logFile);
  } catch (error) {
    console.error('Error uploading log file:', error);
    res.status(500).json({ message: 'Error uploading log file' });
  }
};

exports.getLogFiles = async (req, res) => {
  try {
    const logFiles = await LogFile.find({ uploadedBy: req.userId })
      .select('name size enabled uploadedAt logs')
      .sort('-uploadedAt');
    res.json(logFiles);
  } catch (error) {
    console.error('Error fetching log files:', error);
    res.status(500).json({ message: 'Error fetching log files' });
  }
};

exports.toggleLogFile = async (req, res) => {
  try {
    const logFile = await LogFile.findOne({ _id: req.params.id, uploadedBy: req.userId }); // Updated to use req.userId
    if (!logFile) {
      return res.status(404).json({ message: 'Log file not found' });
    }
    
    logFile.enabled = !logFile.enabled;
    await logFile.save();
    res.json(logFile);
  } catch (error) {
    console.error('Error toggling log file:', error);
    res.status(500).json({ message: 'Error toggling log file' });
  }
};

exports.deleteLogFile = async (req, res) => {
  try {
    const result = await LogFile.deleteOne({ _id: req.params.id, uploadedBy: req.userId }); // Updated to use req.userId
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Log file not found' });
    }
    res.json({ message: 'Log file deleted successfully' });
  } catch (error) {
    console.error('Error deleting log file:', error);
    res.status(500).json({ message: 'Error deleting log file' });
  }
};