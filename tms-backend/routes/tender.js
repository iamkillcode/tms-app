const express = require("express");
const { 
  createTender,
  updateTender,
  addDropdownOption 
} = require("../controllers/tenderController");
const { authenticateToken } = require("../middleware/auth");
const Tender = require("../models/Tender");

const router = express.Router();

/**
 * Create a new tender
 * POST /
 * @requires authentication
 */
router.post("/", authenticateToken, createTender);

/**
 * Update an existing tender
 * PUT /update
 * @requires authentication
 */
router.put("/update", authenticateToken, updateTender);

/**
 * Get tenders for the logged-in user
 * GET /
 * @requires authentication
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tenders = await Tender.find({ createdBy: req.user.id });
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tenders" }); // Changed to 500 for server error
  }
});

/**
 * Add a new dropdown option
 * POST /add-option
 * @requires authentication
 */
router.post("/add-option", authenticateToken, addDropdownOption);

module.exports = router;
