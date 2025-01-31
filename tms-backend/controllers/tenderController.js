const Tender = require("../models/Tender");
const DropdownOption = require("../models/DropdownOption");

/**
 * Create a new tender
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object 
 */
const createTender = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.tenderNumber || !req.body.details) {
      return res.status(400).json({ error: "Tender number and details are required" });
    }

    const { tenderNumber, details } = req.body;

    // Create new tender document
    const tender = new Tender({ 
      tenderNumber, 
      details, 
      createdBy: req.user.id 
    });

    await tender.save();
    res.status(201).json(tender);
  } catch (error) {
    console.error("Error creating tender:", error);
    res.status(400).json({ error: "Error creating tender" });
  }
};

/**
 * Update an existing tender
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 */
const updateTender = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.id || !req.body.details) {
      return res.status(400).json({ error: "Tender ID and details are required" });
    }

    const { id, details } = req.body;

    // Find and update tender
    const tender = await Tender.findByIdAndUpdate(
      id,
      { details },
      { new: true }
    );

    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    res.status(200).json(tender);
  } catch (error) {
    console.error("Error updating tender:", error);
    res.status(400).json({ error: "Error updating tender" });
  }
};

const generateTenderNumber = async (req, res) => {
    const { department, categoryCode, procurementType, lotNumber, amendmentNumber, callOffNumber } = req.body;
    const year = new Date().getFullYear();
    const sequentialNumber = await getNextSequentialNumber(); // Implement this function to get the next number

    let tenderNumber = `FDA/${department}/${year}/${categoryCode}/${procurementType}/${sequentialNumber}`;
    if (lotNumber) tenderNumber += `/${lotNumber}`;
    if (amendmentNumber) tenderNumber += `/${amendmentNumber}`;
    if (callOffNumber) tenderNumber += `/${callOffNumber}`;

    res.json({ tenderNumber });
};

// Add a new endpoint to add dropdown options
const addDropdownOption = async (req, res) => {
    const { type, value } = req.body;
    if (!type || !value) {
        return res.status(400).json({ error: "Type and value are required" });
    }
    try {
        const option = new DropdownOption({ type, value });
        await option.save();
        res.status(201).json({ message: `Added ${value} to ${type}` });
    } catch (error) {
        res.status(400).json({ error: "Error adding option" });
    }
};

// Export the controller functions
console.log(createTender, updateTender, generateTenderNumber, addDropdownOption);
module.exports = { createTender, updateTender, generateTenderNumber, addDropdownOption };
