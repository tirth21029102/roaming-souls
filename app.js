import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import AppError from './utilities/appError.js';
import globalErrorHandler from './controllers/error.controller.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cityRouter from './routes/city.routes.js';
import chatRouter from './routes/chat.routes.js';
import locationRouter from './routes/location.routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_URL = process.env.CLIENT_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

const allowedOrigins = ['http://localhost:5173', CLIENT_URL];

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log('🙋 Request received at:', req.requestTime);
    next();
  });
}

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the backend API 🚀',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/cities', cityRouter);
app.use('/api/conversations', chatRouter);
app.use('/api/locations', locationRouter);

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
