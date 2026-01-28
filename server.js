import http from 'http';
import app from './app.js';
import { initSocket } from './socket/index.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.SERVER_PORT || 9000;
const server = http.createServer(app);

// Initialize socket
initSocket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
