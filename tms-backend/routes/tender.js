import express from 'express';
import authMiddleware from '../middleware/auth';
import Tender from '../models/Tender';
const router = express.Router();

// Get sequential number
router.post('/sequential', authMiddleware, async (req, res) => {
  try {
    const counter = await Tender.findOneAndUpdate(
      { type: 'sequential' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    
    res.json({ sequentialNumber: counter.count });
  } catch (error) {
    res.status(500).json({ message: 'Error getting sequential number' });
  }
});

// Save tender data
router.post('/', authMiddleware, async (req, res) => {
  try {
    const requiredFields = [
      'activity', 
      'category', 
      'procurementType', 
      'tenderNumber', 
      'sequentialNumber'
    ];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `${field} is required` 
        });
      }
    }

    const tender = new Tender({
      activity: req.body.activity,
      category: req.body.category,
      categoryType: req.body.categoryType,
      procurementType: req.body.procurementType,
      lotNumber: req.body.lotNumber,
      callOffNumber: req.body.callOffNumber,
      amendmentNumber: req.body.amendmentNumber,
      status: req.body.status || 'in-progress',
      tenderNumber: req.body.tenderNumber,
      sequentialNumber: req.body.sequentialNumber,
      generatedBy: req.user.id
    });

    await tender.save();
    res.status(201).json(tender);
  } catch (error) {
    res.status(400).json({ 
      message: error.message || 'Error saving tender' 
    });
  }
});

export default router;
