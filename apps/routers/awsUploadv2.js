const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const s3Client = new AWS.S3({
    accessKeyId: 'AKIAVNHUZ3Q5MEDGTGPJ',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
});

const uploadParams = {
    Bucket: 'dts02bcaa',
    Key: '', // pass key
    Body: null, // pass file body
};


router.post('/api/file/upload', upload.single("file"), (req, res) => {
    const params = uploadParams;

    uploadParams.Key = req.file.originalname;
    uploadParams.Body = req.file.buffer;

    s3Client.upload(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error -> " + err });
        }
        res.json({
            message: 'File uploaded successfully',
            'filename': req.file.originalname,
            'location': data.Location
        });
    });
});

module.exports = router;