import http from 'http';
import app from './app.js';
import { initSocket } from './socket/index.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 9000;
const server = http.createServer(app);

// Initialize socket
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
