const express = require('express');
const Tender = require('../models/Tender');
const { authenticateToken } = require('../middleware/auth');
const { createTender, updateTender } = require('../controllers/tenderController');
const router = express.Router();
// routes/tender.js
const authenticate = require('../middleware/auth');


// Create a new tender
router.post('/', authenticateToken, createTender);

// Update an existing tender
router.post('/update', authenticateToken, updateTender);

// Get tenders for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tenders = await Tender.find({ createdBy: req.user.id });
    res.json(tenders);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching tenders' });
  }
});

module.exports = router; 