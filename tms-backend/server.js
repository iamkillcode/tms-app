const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const authRoutes = require('./routes/auth');
const tenderRoutes = require('./routes/tender');
const isoRoutes = require('./routes/iso');
const categoryRoutes = require('./routes/category'); // Add this line

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB with error handling
mongoose.connect(MONGODB_URI, {
  // Remove deprecated options
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Tender Management System Backend');
});

app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/isos', isoRoutes);
app.use('/api/categories', categoryRoutes); // Add this line

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});