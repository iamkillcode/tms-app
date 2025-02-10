import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import auth from './routes/auth.js';
import tenderRoutes from './routes/tenders.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false
});

// Validate environment variables before starting
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI required in production');
  }
};

// Add this after environment validation
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable not defined");
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

// Call connectDB before starting server
connectDB();

mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB Atlas...');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB Atlas connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Atlas connection error:', err);
});

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Tender Management System Backend');
});

app.use('/api/auth', authLimiter);
app.use('/api/auth', auth);
app.use('/api/tenders', tenderRoutes);

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
