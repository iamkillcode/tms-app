import Tender from '../models/Tender.js';
import { getNextSequentialNumber } from '../utils/sequentialNumberGenerator.js';

const validateTenderFormat = (tenderNumber) => {
  const pattern = /^FDA\/PSD\/\d{4}\/(A\.\d+(?:\.\d+)?)\/([A-Z]+)-\d{4}(?: \(\d{2}\))?(?: \(C\d{2}\))?(?: \(A\d+\))?$/;
  return pattern.test(tenderNumber);
};

export const createTender = async (req, res) => {
  try {
    const tender = new Tender({
      ...req.body,
      generatedBy: req.user._id
    });

    if (!validateTenderFormat(tender.tenderNumber)) {
      return res.status(400).json({ error: 'Invalid tender number format' });
    }

    await tender.save();
    res.status(201).json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};