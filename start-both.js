const { spawn } = require('child_process');

console.log('====================================');
console.log('🚀 Starting HunarHub Full-Stack App');
console.log('====================================\n');

// Start Backend
console.log('⏳ Starting Backend Server...');
const backend = spawn('node', ['server.js'], { 
  cwd: './backend', 
  stdio: 'inherit',
  shell: true 
});

// Start Frontend
console.log('⏳ Starting Frontend Server...');
const frontend = spawn('npm', ['run', 'dev'], { 
  cwd: './frontend', 
  stdio: 'inherit',
  shell: true 
});

backend.on('error', (err) => {
  console.error('Failed to start backend server:', err);
});

frontend.on('error', (err) => {
  console.error('Failed to start frontend server:', err);
});
