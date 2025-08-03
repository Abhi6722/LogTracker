const { io } = require('socket.io-client');

class WebSocketTest {
  constructor() {
    this.socket = null;
    this.token = 'test-access-token'; // Replace with actual token
    this.projectId = 'project-id';
    this.isAuthenticated = false;
  }

  connect() {
    console.log('🚀 Connecting to Socket.IO...');
    
    this.socket = io('http://localhost:8081', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
      this.authenticate();
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket.IO server');
      this.isAuthenticated = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    this.socket.on('authenticated', (data) => {
      console.log('✅ Authentication successful:', data);
      this.isAuthenticated = true;
      this.joinProject();
    });

    this.socket.on('joined-project', (data) => {
      console.log('✅ Joined project successfully:', data);
    });

    this.socket.on('new-logs', (data) => {
      console.log('📊 New logs received:', data);
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  }

  authenticate() {
    console.log('🔐 Authenticating...');
    this.socket.emit('authenticate', {
      token: this.token,
      projectId: this.projectId
    });
  }

  joinProject() {
    console.log(' Joining project...');
    this.socket.emit('join-project', this.projectId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Run the test
const test = new WebSocketTest();
test.connect();

// Keep connection alive
setInterval(() => {
  if (test.socket && test.socket.connected) {
    console.log('💓 Connection alive...');
  }
}, 30000);

// Handle process exit
process.on('SIGINT', () => {
  console.log('\n👋 Disconnecting...');
  test.disconnect();
  process.exit(0);
});
