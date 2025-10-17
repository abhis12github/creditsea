const xml2js = require('xml2js');

async function parseCreditReport(xmlBufferOrString) {
    try {
        // Accept Buffer or String
        const xml = Buffer.isBuffer(xmlBufferOrString)
            ? xmlBufferOrString.toString('utf8')
            : xmlBufferOrString;

        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);

        const profile = result.INProfileResponse;
        const basic = profile.Current_Application.Current_Application_Details.Current_Applicant_Details;
        const score = profile.SCORE;

        const accounts = profile.CAIS_Account.CAIS_Account_DETAILS
            ? Array.isArray(profile.CAIS_Account.CAIS_Account_DETAILS)
                ? profile.CAIS_Account.CAIS_Account_DETAILS
                : [profile.CAIS_Account.CAIS_Account_DETAILS]
            : [];

        const creditAccounts = accounts.map(acc => ({
            accountNumber: acc.Account_Number || '',
            bankName: acc.Subscriber_Name || '',
            currentBalance: Number(acc.Current_Balance || 0),
            overdueAmount: Number(acc.Amount_Past_Due || 0),
            address: acc.CAIS_Holder_Address_Details
                ? [
                    acc.CAIS_Holder_Address_Details.First_Line_Of_Address_non_normalized,
                    acc.CAIS_Holder_Address_Details.Second_Line_Of_Address_non_normalized,
                    acc.CAIS_Holder_Address_Details.Third_Line_Of_Address_non_normalized,
                    acc.CAIS_Holder_Address_Details.City_non_normalized
                ]
                    .filter(line => line && line.trim() !== '') // remove empty or whitespace-only lines
                    .join(', ')
                : ''
        }));

        return {
            basicDetails: {
                name: `${basic.First_Name || ''} ${basic.Last_Name || ''}`.trim(),
                mobilePhone: basic.MobilePhoneNumber || '',
                pan: accounts[0]?.CAIS_Holder_Details?.Income_TAX_PAN || '',
                creditScore: Number(score.BureauScore || 0)
            },
            reportSummary: {
                totalAccounts: Number(profile.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountTotal || 0),
                activeAccounts: Number(profile.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountActive || 0),
                closedAccounts: Number(profile.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountClosed || 0),
                currentBalance: Number(profile.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_All || 0),
                securedAmount: Number(profile.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_Secured || 0),
                unsecuredAmount: Number(profile.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_UnSecured || 0),
                last7DaysEnquiries: Number(profile.TotalCAPS_Summary.TotalCAPSLast7Days || 0),
            },
            creditAccounts,
        };
    } catch (err) {
        throw new Error(`Failed to parse XML: ${err.message}`);
    }
};

module.exports = { parseCreditReport };