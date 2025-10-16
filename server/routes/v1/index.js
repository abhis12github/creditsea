const express=require("express");
const router=express.Router();
const multer = require('multer');
const { uploadCreditReport } = require("../../controllers/creditReportController");

router.get('/test',function(req,res){
    return res.json({"test":true});
});

// upload routes

// Use memoryStorage so files are never written to disk

// multer middleware to handle single upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') cb(null, true);
        else cb(new Error('Only XML files are allowed'));
    }
});

// upload route
router.post('/upload/xml', upload.single('file'), uploadCreditReport);

module.exports = router;