const Tender = require("../models/Tender");
const DropdownOption = require("../models/DropdownOption");
const { getNextSequentialNumber } = require("../utils/sequentialNumberGenerator");
const { validationResult } = require("express-validator");

const departmentAbbreviations = {
  'IT': 'IT',
  'Finance': 'FIN',
  'Procurement': 'PSD',
  'Operations': 'OPS',
  'HR': 'HR'
};

/**
 * Generate a unique tender number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with generated tender number
 */
const generateTenderNumber = async (req, res, next) => {
  try {
    const { department, categoryCode, procurementType, amendmentNumber, callOffNumber, amendmentNumberOnContract } = req.body;
    const year = new Date().getFullYear();
    const sequentialNumber = await getNextSequentialNumber();

    const departmentAbbreviation = departmentAbbreviations[department] || department;

    let tenderNumber = `FDA/${departmentAbbreviation}/${year}/${categoryCode}/${procurementType}-${sequentialNumber.toString().padStart(4, "0")}`;
    if (amendmentNumber) tenderNumber += ` (A${amendmentNumber})`;
    if (callOffNumber) tenderNumber += ` (C${callOffNumber.toString().padStart(3, "0")})`;
    if (amendmentNumberOnContract) tenderNumber += ` (A${amendmentNumberOnContract})`;

    res.json({ tenderNumber });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTenderNumber,
};
