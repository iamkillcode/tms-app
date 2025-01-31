const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const tenderRoutes = require('./routes/tender');
const isoRoutes = require('./routes/iso');

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

app.get('/', (req, res) => {
  res.send('Tender Management System Backend');
});

app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/isos', isoRoutes);

app.get('/api/tenders', (req, res) => {
  res.json({ tenders: [] }); // Example response
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
