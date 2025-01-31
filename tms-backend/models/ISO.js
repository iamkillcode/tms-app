const mongoose = require('mongoose');

const isoSchema = new mongoose.Schema({
  isoNumber: { type: String, required: true, unique: true },
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender' },
});

module.exports = mongoose.model('ISO', isoSchema); 