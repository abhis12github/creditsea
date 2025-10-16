const mongoose = require('mongoose');

const CreditAccountSchema = new mongoose.Schema({
    accountNumber: String,
    bankName: String,
    currentBalance: Number,
    overdueAmount: Number,
    address: String
});

const CreditReportSchema = new mongoose.Schema({
    basicDetails: {
        name: String,
        mobilePhone: String,
        pan: String,
        creditScore: Number,
    },
    reportSummary: {
        totalAccounts: Number,
        activeAccounts: Number,
        closedAccounts: Number,
        currentBalance: Number,
        securedAmount: Number,
        unsecuredAmount: Number,
        last7DaysEnquiries: Number,
    },
    creditAccounts: [CreditAccountSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CreditReport', CreditReportSchema);