const multer = require('multer');
var MenuImageUpload = require('../models/MenuImageUpload');
const fs = require('fs');
const path = require('path');

exports.create = async(req, res) => {
    try {
        let payload = {
            image: req.file.path,
            storeId: req.body.storeId
        }
        const image = await MenuImageUpload.create({
            ...payload
        });
        res.status(200).json({
            status: true,
            data: image,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            status: false,
        })
    }
};

exports.findOne = (req, res) => {
    const { storeId,filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'images/' + filename);
    return res.sendFile(fullfilepath);
};