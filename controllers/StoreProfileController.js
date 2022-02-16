var StoreProfile = require('../models/StoreProfile');
const path = require('path');

exports.create = async (req, res) => {
    try {
        let payload = {
            StoreType: req.body.StoreType,
            StoreName: req.body.StoreName,
            Phone: req.body.Phone,
            RestDate: req.body.RestDate,
            MenuUrl: req.body.MenuUrl,
            image: req.file.filename,
        }
        const image = await StoreProfile.create({
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

exports.findAll = (req, res) => {
    StoreProfile.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                store:
                    err.store || "Some error occurred while retrieving stores.",
            });
        });
};

exports.findOne = async (req, res) => {
    var storeId = req.params.storeId
	StoreProfile.findById(storeId).then((result) => {
        res.send(result);
        console.log(result);
        // const dirname = path.resolve();
		// return res.sendFile(path.join(dirname, '/images/' + result.image));
	}).catch((e) =>  res.send(e) );
};

exports.findMenu = async (req, res) => {
    var storeId = req.params.storeId
	StoreProfile.findById(storeId).then((result) => {
        const dirname = path.resolve();
		return res.sendFile(path.join(dirname, '/images/' + result.image));
	}).catch((e) =>  res.send(e) );
}

exports.findType = (req, res) => {
    StoreProfile.aggregate([
        {
            $match: {
                "StoreType": {"$in": [[req.params.type]]}
            }
        }
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data);
    })
}

exports.update = (req, res) => {
    const storeId = req.params.storeId;
    const body = req.body;
    const StoreType = body.StoreType;
    const Phone = body.Phone;
    const RestDate = body.RestDate;
    const MenuUrl = body.MenuUrl;

    const updates = {
        StoreType,
        Phone,
        RestDate,
        MenuUrl
    };

    if(req.file) {
        const image = req.file.filename;
        updates.image = image;
    }

    StoreProfile.findOneAndUpdate(storeId, {
        $set: updates
    }, {
        new: true
    }).then(data => {
        res.send(data);
        console.log("Store Profile Updated!");
    }).catch(err => {
        console.log(err);
    })
    // StoreProfile.findByIdAndUpdate((req.params.storeId),
    // { StoreType: req.body.StoreType, Phone: req.body.Phone, RestDate: req.body.RestDate, MenuUrl: req.body.MenuUrl, image: req.file.filename }, 
    // function(err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.send(data);
    //         console.log("Store Profile Updated!");
    //     }
    // });
};

exports.delete = (req, res) => {
    StoreProfile.findByIdAndDelete((req.params.storeId),
        function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send(data);
                console.log("Store Deleted!");
            }
        });
};