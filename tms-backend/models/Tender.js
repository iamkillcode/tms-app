const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  tenderNumber: { type: String, required: true, unique: true },
  details: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Tender', tenderSchema); 