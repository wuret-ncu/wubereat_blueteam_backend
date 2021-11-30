const multer = require('multer');
var MenuImageUpload = require('../models/MenuImageUpload');
const fs = require('fs');
const path = require('path');

exports.create = async(req, res, next) => {
    const img = req.file
    if (!img) {
        const err = new Error('Please upload a file')
        err.httpStatusCode = 400
        return next(err)
    }
    res.send(img)
};

exports.findOne = (req, res) => {
    const { filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'images/' + filename);
    return res.sendFile(fullfilepath);
};