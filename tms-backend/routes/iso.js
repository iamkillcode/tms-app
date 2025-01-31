const express = require('express');
const ISO = require('../models/ISO');
const Tender = require('../models/Tender');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new ISO number for a tender
router.post('/:tenderId', authenticateToken, async (req, res) => {
  try {
    const { tenderId } = req.params;
    const isoNumber = `ISO-${Math.random().toString(36).substr(2, 9)}`;
    const iso = new ISO({ isoNumber, tender: tenderId });
    await iso.save();
    res.status(201).json(iso);
  } catch (error) {
    res.status(400).json({ error: 'Error creating ISO number' });
  }
});

module.exports = router; 