import Tender from '../models/Tender.js';

export const generateSequentialNumber = async (userId) => {
  try {
    let counter = await Tender.findOne({ type: 'counter' });
    
    if (!counter) {
      counter = new Tender({
        type: 'counter',
        sequentialNumber: 0,
        activity: 'counter',
        category: 'counter',
        categoryType: 'counter',
        procurementType: 'counter',
        tenderNumber: 'COUNTER-DOC',
        generatedBy: userId
      });
    }

    counter.sequentialNumber += 1;
    await counter.save();
    
    return counter.sequentialNumber;
  } catch (error) {
    throw new Error(`Failed to generate sequential number: ${error.message}`);
  }
};

export const createTender = async (tenderData, userId) => {
  try {
    const tender = new Tender({
      ...tenderData,
      generatedBy: userId
    });
    
    await tender.save();
    return tender;
  } catch (error) {
    throw new Error(`Failed to create tender: ${error.message}`);
  }
};