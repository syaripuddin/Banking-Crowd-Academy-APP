const send = require('../middleware/awsUpload');
const multer = require('multer');
const express = require("express");

const upload = express.Router();

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})
let upload = multer({ storage: storage, limits: { fileSize: 2000000 } }) //maks 2 mb

upload.post('/upload', upload.single('image'), send.post);