const Tender = require("../models/Tender");
const ISO = require("../models/ISO");

async function getNextSequentialNumber() {
  const result = await Tender.findOneAndUpdate(
    {},
    { $inc: { sequentialNumber: 1 } },
    { 
      new: true,
      upsert: true,
      sort: { createdAt: -1 },
      setDefaultsOnInsert: true 
    }
  );
  return result.sequentialNumber;
}

async function getNextISOSequentialNumber() {
  const result = await ISO.findOneAndUpdate(
    {},
    { $inc: { sequentialNumber: 1 } },
    { 
      new: true,
      upsert: true,
      sort: { createdAt: -1 },
      setDefaultsOnInsert: true 
    }
  );
  return result.sequentialNumber;
}

module.exports = { getNextSequentialNumber, getNextISOSequentialNumber };
