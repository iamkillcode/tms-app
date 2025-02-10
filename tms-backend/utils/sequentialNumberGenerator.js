import Tender from '../models/Tender.js';
// Remove ISO import as it's not being used
// import ISO from '../models/ISO.js';

export const getNextSequentialNumber = async () => {
  try {
    // Create initial counter if it doesn't exist
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
        generatedBy: 'system'
      });
    }

    // Increment the counter
    counter.sequentialNumber += 1;
    await counter.save();

    console.log('Generated sequence number:', counter.sequentialNumber);
    return counter.sequentialNumber;
  } catch (error) {
    console.error('Sequence generation error:', error);
    throw new Error(`Sequence generation failed: ${error.message}`);
  }
};

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
