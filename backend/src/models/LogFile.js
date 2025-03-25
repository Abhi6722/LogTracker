const mongoose = require('mongoose');

const logFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  enabled: { type: Boolean, default: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  logs: [{
    level: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true },
    source: String,
    requestId: String,
    headers: mongoose.Schema.Types.Mixed,
    method: String,
    query: mongoose.Schema.Types.Mixed,
    url: String
  }]
}, { timestamps: true });

logFileSchema.index({ 'logs.timestamp': 1 });
logFileSchema.index({ 'logs.level': 1 });
logFileSchema.index({ 'logs.requestId': 1 });

const LogFile = mongoose.model('LogFile', logFileSchema);

module.exports = LogFile;