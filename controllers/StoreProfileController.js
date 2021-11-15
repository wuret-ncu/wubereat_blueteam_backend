var StoreProfile = require('../models/StoreProfile');

exports.create = (req, res) => {
    const store = new StoreProfile({
        StoreType: req.body.StoreType,
        StoreName: req.body.StoreName,
        Phone: req.body.Phone,
        RestDate: req.body.RestDate,
        MenuUrl: req.body.MenuUrl,
    });
    store
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                status:1,
                store:
                    err.store || "Some error occurred while creating the Store.",
            });
        });
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

exports.findOne = (req, res) => {
    StoreProfile.findById(req.params.storeId)
        .then((data) => {
            if(!data) {
                return res.status(404),send({
                    store: "Store not found with id" + req.params.storeId,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "String") {
                return res.status(404).send({
                    store: "Store not found with id" + req.params.storeId,
                });
            }
            return res.status(500).send({
                store: "Store not found with id" + req.params.storeId,
            });
        });
};

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