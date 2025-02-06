import mongoose from 'mongoose';

const tenderSchema = new mongoose.Schema({
  activity: { type: String, required: true },
  category: { type: String, required: true },
  categoryType: { type: String, required: true },
  procurementType: { type: String, required: true },
  lotNumber: String,
  callOffNumber: String,
  amendmentNumber: String,
  status: { type: String, default: 'in-progress' },
  tenderNumber: { type: String, required: true, unique: true },
  sequentialNumber: { type: Number, required: true },
  generatedDate: { type: Date, default: Date.now },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String } // For counter document
});

tenderSchema.index({ tenderNumber: 1 }, { unique: true });
tenderSchema.index({ generatedBy: 1 });
tenderSchema.index({ status: 1 });

export default mongoose.model('Tender', tenderSchema); 