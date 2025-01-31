const Tender = require("../models/Tender");
const ISO = require("../models/ISO");

async function getNextSequentialNumber() {
    const lastTender = await Tender.findOne().sort({ createdAt: -1 });
    return lastTender ? lastTender.sequentialNumber + 1 : 1;
}

async function getNextISOSequentialNumber() {
    const lastISO = await ISO.findOne().sort({ createdAt: -1 });
    return lastISO ? lastISO.sequentialNumber + 1 : 1;
}

module.exports = { getNextSequentialNumber, getNextISOSequentialNumber };
