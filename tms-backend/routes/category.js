const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/codes', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../assets/categories.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const categoryCodes = JSON.parse(data);
    res.json(categoryCodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category codes' });
  }
});

module.exports = router;