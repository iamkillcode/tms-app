const express = require("express");
const { body, param } = require("express-validator");
const tenderController = require("../controllers/tenderController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @route POST /api/tenders
 * @desc Create a new tender
 * @access Private
 */
router.post(
  "/",
  authenticateToken,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("budget").isNumeric().withMessage("Budget must be a number"),
  ],
  tenderController.createTender
);

/**
 * @route PUT /api/tenders/:id
 * @desc Update an existing tender
 * @access Private
 */
router.put(
  "/:id",
  authenticateToken,
  [
    param("id").isMongoId().withMessage("Invalid tender ID"),
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
    body("budget").optional().isNumeric().withMessage("Budget must be a number"),
  ],
  tenderController.updateTender
);

/**
 * @route POST /api/tenders/generate-number
 * @desc Generate a unique tender number
 * @access Private
 */
router.post(
  "/generate-number",
  authenticateToken,
  [
    body("department").notEmpty().withMessage("Department is required"),
    body("categoryCode").notEmpty().withMessage("Category code is required"),
    body("procurementType").notEmpty().withMessage("Procurement type is required"),
  ],
  tenderController.generateTenderNumber
);

/**
 * @route POST /api/tenders/dropdown-option
 * @desc Add a new dropdown option
 * @access Private
 */
router.post(
  "/dropdown-option",
  authenticateToken,
  [body("type").notEmpty().withMessage("Type is required"), body("value").notEmpty().withMessage("Value is required")],
  tenderController.addDropdownOption
);

module.exports = router;
