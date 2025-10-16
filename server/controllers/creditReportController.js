const CreditReport = require('../models/creditReport');
const { parseCreditReport } = require('../utils/parseCreditReport'); 

// Controller for handling XML upload
exports.uploadCreditReport = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Parse XML from buffer
        const report = await parseCreditReport(req.file.buffer);

        // Save to database
        const savedReport = await CreditReport.create(report);

        res.json({ message: 'Report processed and saved', id: savedReport._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
