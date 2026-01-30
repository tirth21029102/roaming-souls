import http from 'http';
import app from './app.js';
import { initSocket } from './socket/index.js';
import dotenv from 'dotenv';
import { pool } from './database/pool.js';
dotenv.config();

const PORT = process.env.PORT || 9000;
const server = http.createServer(app);

// Initialize socket
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async signal => {
  console.log(`\n🛑 ${signal} received. Closing MySQL pool...`);
  try {
    await pool.end();
    console.log('✅ MySQL pool closed');
  } catch (err) {
    console.error('❌ Error closing MySQL pool:', err);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown); // Ctrl + C
process.on('SIGTERM', shutdown); // Railway / Docker / PM2 / VPS
