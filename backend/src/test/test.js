// Example: Node.js application sending logs
const axios = require('axios');

class LogTracker {
  constructor(apiKey, projectId) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.baseUrl = 'http://localhost:8081/api';
  }

  async sendLog(level, message, metadata = {}) {
    try {
      const log = {
        level,
        message,
        timestamp: new Date().toISOString(),
        source: 'nodejs-app',
        ...metadata
      };

      const response = await axios.post(`${this.baseUrl}/logs/upload-with-key`, {
        logs: [log]
      }, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Log sent successfully:', response.data);
    } catch (error) {
      console.error('❌ Failed to send log:', error.response?.data || error.message);
    }
  }

  async sendBatchLogs(logs) {
    try {
      const response = await axios.post(`${this.baseUrl}/logs/upload-with-key`, {
        logs: logs.map(log => ({
          ...log,
          timestamp: log.timestamp || new Date().toISOString(),
          source: log.source || 'nodejs-app'
        }))
      }, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Batch logs sent successfully:', response.data);
    } catch (error) {
      console.error('❌ Failed to send batch logs:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.error('💡 Check if your API key is correct');
      }
    }
  }
}

// Test function
async function runTest() {
  console.log('🚀 Starting LogTracker test...\n');

  // You need to replace these with actual values from your database
  const API_KEY = 'test-api-key';
  const PROJECT_ID = 'project-id';

  if (API_KEY === 'your-actual-api-key-here') {
    console.log('❌ Please update the API_KEY and PROJECT_ID in the test file');
    console.log('💡 To get these values:');
    console.log('   1. Create a project via API or database');
    console.log('   2. Get the API key from the project');
    console.log('   3. Update the constants in this file');
    return;
  }

  const logger = new LogTracker(API_KEY, PROJECT_ID);

  // Test single log
  console.log(' Testing single log...');
  await logger.sendLog('info', 'User logged in', { userId: '123', action: 'login' });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test batch logs
  console.log('\n Testing batch logs...');
  await logger.sendBatchLogs([
    { level: 'error', message: 'Database connection failed', metadata: { db: 'postgres' } },
    { level: 'warn', message: 'High memory usage detected', metadata: { memory: '85%' } },
    { level: 'info', message: 'Application started', metadata: { version: '1.0.0' } },
    { level: 'debug', message: 'Debug information', metadata: { debug: true } }
  ]);

  console.log('\n✅ Test completed!');
}

// Run the test
runTest().catch(console.error);
