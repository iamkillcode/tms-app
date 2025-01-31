const mongoose = require('mongoose');

const dropdownOptionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    value: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('DropdownOption', dropdownOptionSchema); 