var MenuImageUpload = require('../models/MenuImageUpload');

exports.create = async(req, res) => {
    try {
        let payload = {
            image: req.file.path
        }
        let image = await MenuImageUpload.create({
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
