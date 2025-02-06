import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { generateSequentialNumber, createTender } from '../controllers/tenderController.js';
import Tender from '../models/Tender.js';

const router = express.Router();

// Debug middleware for all tender routes
router.use((req, res, next) => {
  console.log('Tender route accessed:', req.method, req.path);
  console.log('Headers:', req.headers);  // Add headers logging
  next();
});

// Sequential number endpoint
router.post('/sequential', authMiddleware, async (req, res) => {
  console.log('Sequential number generation started');
  try {
    // Find the latest sequential number
    const latestTender = await Tender.findOne({})
      .sort({ sequentialNumber: -1 }) // Sort by sequential number in descending order
      .select('sequentialNumber')
      .lean();
    
    console.log('Latest tender found:', latestTender);

    // Start from 1 if no tenders exist, or increment the latest number
    const newSequentialNumber = latestTender ? latestTender.sequentialNumber + 1 : 1;
    console.log('New sequential number:', newSequentialNumber);

    // Verify the number is valid
    if (!Number.isInteger(newSequentialNumber) || newSequentialNumber < 1) {
      throw new Error('Invalid sequential number generated');
    }

    res.json({ 
      sequentialNumber: newSequentialNumber,
      previousNumber: latestTender?.sequentialNumber || 0
    });
  } catch (error) {
    console.error('Error in sequential number generation:', error);
    res.status(500).json({ 
      message: 'Error generating sequential number',
      error: error.message 
    });
  }
});

// Create tender endpoint
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
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const tender = await createTender(req.body, req.user.id);
    res.status(201).json(tender);
  } catch (error) {
    console.error('Error creating tender:', error);
    res.status(400).json({ message: error.message });
  }
});

// Save new tender with generated number
router.post('/save', authMiddleware, async (req, res) => {
  try {
    // Find the latest tender to get the last sequential number
    const latestTender = await Tender.findOne()
      .sort({ sequentialNumber: -1 })
      .limit(1);
    
    const nextSequentialNumber = latestTender ? latestTender.sequentialNumber + 1 : 1;

    // Create new tender with user input and generated number
    const newTender = new Tender({
      ...req.body,
      sequentialNumber: nextSequentialNumber,
      generatedBy: req.user._id,  // Use the authenticated user's ID
      generatedDate: new Date()
    });

    await newTender.save();
    
    // Populate user details before sending response
    await newTender.populate({
      path: 'generatedBy',
      select: 'firstName lastName email name'
    });
    
    res.status(201).json({
      success: true,
      tender: newTender,
      message: 'Tender saved successfully'
    });
  } catch (error) {
    console.error('Error saving tender:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all tenders with populated user data
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tenders = await Tender.find()
      .populate({
        path: 'generatedBy',
        select: 'firstName lastName email name', // Include name field
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ generatedDate: -1 });
    
    // Transform the data to ensure we have a name
    const transformedTenders = tenders.map(tender => {
      const tenderObj = tender.toObject();
      if (tenderObj.generatedBy) {
        // Use name from user profile if available, otherwise use email username
        tenderObj.generatedBy.displayName = 
          tenderObj.generatedBy.name || 
          tenderObj.generatedBy.firstName && tenderObj.generatedBy.lastName ? 
            `${tenderObj.generatedBy.firstName} ${tenderObj.generatedBy.lastName}` :
            tenderObj.generatedBy.email.split('@')[0]; // Get username part of email
      }
      return tenderObj;
    });
    
    res.json(transformedTenders);
  } catch (error) {
    console.error('Error fetching tenders:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;