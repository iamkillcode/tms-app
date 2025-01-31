const Tender = require('../models/Tender');

// Create a new tender
const createTender = async (req, res) => {
  try {
    const { tenderNumber, details } = req.body;
    const tender = new Tender({ tenderNumber, details, createdBy: req.user.id });
    await tender.save();
    res.status(201).json(tender);
  } catch (error) {
    res.status(400).json({ error: 'Error creating tender' });
  }
};

// Update an existing tender
const updateTender = async (req, res) => {
  try {
    const { id, details } = req.body;
    const tender = await Tender.findByIdAndUpdate(id, { details }, { new: true });
    res.status(200).json(tender);
  } catch (error) {
    res.status(400).json({ error: 'Error updating tender' });
  }
};

module.exports = { createTender, updateTender };

console.log('createTender:', exports.createTender);  // Should log a function, not undefined
console.log('updateTender:', exports.updateTender);  // Should log a function, not undefined