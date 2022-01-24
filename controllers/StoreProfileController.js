const e = require('express');
var StoreProfile = require('../models/StoreProfile');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.create = async (req, res) => {
    // try {
    //     let payload = {
    //         StoreType: req.body.StoreType,
    //         StoreName: req.body.StoreName,
    //         Phone: req.body.Phone,
    //         RestDate: req.body.RestDate,
    //         MenuUrl: req.body.MenuUrl,
    //         Image: req.file.path,
    //     }
    //     const image = await StoreProfile.create({
    //         ...payload
    //     });
    //     res.status(200).json({
    //         status: true,
    //         data: image,
    //     })
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({
    //         error: err,
    //         status: false,
    //     })
    // }
    const dirname = path.resolve();
    const store = new StoreProfile({
        StoreType: req.body.StoreType,
        StoreName: req.body.StoreName,
        Phone: req.body.Phone,
        RestDate: req.body.RestDate,
        MenuUrl: req.body.MenuUrl,
        image: req.file.path,
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

exports.findOne = async (req, res) => {
    // const store = await StoreProfile.findByIdAndUpdate(req.params.storeId, req.body = { image: "http://localhost:8080/" }, {new: true});
    StoreProfile.findById(req.params.storeId, {
        image: {
            data: fs.readFileSync(`images/${req.file.originalname}`), contentType: 'foo'
        }
    }, {safe: true, new: true})
        .exec()

    // try {
    //     const store = await StoreProfile.findById(req.params.storeId)
    //     // res.set('Content-Type', 'image/jpg')
    //     res.send(store)
    // } catch (error) {
    //     res.status(404).send()
    // }
    // try {
    //     const store = await StoreProfile.findById(req.params.id)
    //     if (!store) {
    //         throw new Error()
    //     }
    //     res.set('Content-Type', 'image/jpg')
    //     res.send(store.image)
    // } catch (error) {
    //     res.status(404).send()
    // }
    // const { storeId,filename } = req.params;
    // const dirname = path.resolve();
    // const data = StoreProfile.findById(storeId);
    // const fullfilepath = path.join(dirname, 'images/' + filename);
    // console.log(data)
    // return res.sendFile(fullfilepath);
    // try {
    //     let storeId = req.params.storeId
    //     let storeDetails = await StoreProfile.findById(storeId);
    //     res.status(200).json({
    //         status: true,
    //         data: storeDetails,
    //     })
    // } catch (err) {
    //     res.status(500).json({
    //         status: false,
    //         error: err
    //     })
    // }
    // StoreProfile.findById(req.params.storeId)
    //     .then((data) => {
    //         if(!data) {
    //             return res.status(404),send({
    //                 store: "Store not found with id" + req.params.storeId,
    //             });
    //         }
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         if (err.kind === "String") {
    //             return res.status(404).send({
    //                 store: "Store not found with id" + req.params.storeId,
    //             });
    //         }
    //         return res.status(500).send({
    //             store: "Store not found with id" + req.params.storeId,
    //         });
    //     });
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

exports.update = (req, res) => {
    StoreProfile.findByIdAndUpdate((req.params.storeId),
    { StoreType: req.body.StoreType, Phone: req.body.Phone, RestDate: req.body.RestDate, MenuUrl: req.body.MenuUrl }, 
    function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
            console.log("Store Profile Updated!");
        }
    });
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