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

router.post('/generate-iso', authenticateToken, async (req, res) => {
    const { division, department, typeOfLetter } = req.body;
    const year = new Date().getFullYear();
    const sequentialNumber = await getNextISOSequentialNumber(); // Implement this function to get the next ISO number

    const isoNumber = `FDA/${division}/${department}/${typeOfLetter}/${year}/${sequentialNumber}`;
    res.json({ isoNumber });
});

module.exports = router; 