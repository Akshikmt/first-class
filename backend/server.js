import express from 'express';
import cors from 'cors';
import { initDB } from './utils/db.js';
import apiRouter from './routes/api.js';

// Initialize the database and ensure directory structure & seeds exist
initDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors({
  origin: '*', // For local dev flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// API Routes mounting
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend server is running perfectly.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    message: 'An unexpected internal server error occurred!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Chakraborty's First Classes Backend is running!`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
