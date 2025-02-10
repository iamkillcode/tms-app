import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createTender } from '../controllers/tenderController.js';
import { getNextSequentialNumber } from '../utils/sequentialNumberGenerator.js';
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
    const tender = new Tender({
      ...req.body,
      generatedBy: req.user._id
    });
    await tender.save();
    return res.status(201).json(tender);
  } catch (error) {
    console.error('Save tender error:', error);
    return res.status(500).json({
      error: 'Failed to save tender',
      details: error.message
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

// Get next sequence number
router.get('/next-sequence', authMiddleware, async (req, res) => {
  try {
    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('Generating sequence for user:', req.user._id);
    
    // Get next number
    const number = await getNextSequentialNumber();
    
    if (!number && number !== 0) {
      throw new Error('Failed to generate valid sequence number');
    }

    console.log('Generated sequence number:', number);
    
    // Send response
    return res.status(200).json({
      sequentialNumber: number,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sequence generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate sequence number',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;