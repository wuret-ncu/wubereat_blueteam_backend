const e = require('express');
var StoreProfile = require('../models/StoreProfile');
const multer = require('multer');
const fs = require('fs');

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
    // const store = new StoreProfile({
    //     StoreType: req.body.StoreType,
    //     StoreName: req.body.StoreName,
    //     Phone: req.body.Phone,
    //     RestDate: req.body.RestDate,
    //     MenuUrl: req.body.MenuUrl,
    //     image: req.file.buffer,
    // });
    // store
    //     .save()
    //     .then((data) => {
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             status:1,
    //             store:
    //                 err.store || "Some error occurred while creating the Store.",
    //         });
    //     });
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
		res.render('menu', {StoreType : result.StoreType, StoreName : result.StoreName, Phone : result.Phone, RestDate : result.RestDate, MenuUrl : result.MenuUrl, image : result.image});
	}).catch((e) =>  res.send(e) );
    // let thing = new StoreProfile({ storeId: req.params.storeId });
    // const dirname = path.resolve();
    // const fullfilepath = path.join(dirname, 'images/' + req.file.filename);
    
    // req.body.thing = JSON.parse(req.body.thing);
    // thing = {
    //     storeId: req.params.storeId,
    //     StoreType: req.body.thing.StoreType,
    //     StoreName: req.body.thing.StoreName,
    //     Phone: req.body.thing.Phone,
    //     RestDate: req.body.thing.RestDate,
    //     MenuUrl: req.body.thing.MenuUrl,
    //     image: fullfilepath,
    // };
    // StoreProfile.findOne({storeId: req.params.storeId}, thing).then(
    //     () => {
    //       res.status(201).json({
    //         message: 'Store information show successfully!'
    //       });
    //     }
    //   ).catch(
    //     (error) => {
    //       res.status(400).json({
    //         error: error
    //       });
    //     }
    //   );
    // StoreProfile.findById(req.params.storeId)
    // console.log(res.file.path)
    // const dirname = path.resolve();
    // const fullfilepath = path.join(dirname, res.file.path);
    // return res.sendFile(fullfilepath);
    // const store = await StoreProfile.findByIdAndUpdate(req.params.storeId, req.body = { image: "http://localhost:8080/" }, {new: true});
    // try{
    //     const store = await StoreProfile.findById(req.params.storeId);
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(JSON.stringify({
    //         image: Buffer.from(image)
    //     }));
    // }
    // catch(err) {
    //     res.status(404).json({
    //         status: false,
    //         error: err
    //     })
    // }
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
    // const StoreType = req.body.StoreType;
    // const Phone = req.body.Phone;
    // const RestDate = req.body.RestDate;
    // const MenuUrl = req.body.MenuUrl;
    // const image = req.file.filename;

    
    if (req.file) {
        var updates = {
            StoreType: req.body.StoreType,
            Phone: req.body.Phone,
            RestDate: req.body.RestDate,
            MenuUrl: req.body.MenuUrl,
            // image: req.file.filename
        }
    } else {
        var updates = {
            StoreType: req.body.StoreType,
            Phone: req.body.Phone,
            RestDate: req.body.RestDate,
            MenuUrl: req.body.MenuUrl,
        }
    }
    var edit = StoreProfile.findByIdAndUpdate(req.params.storeId, {
        StoreType: req.body.StoreType,
        Phone: req.body.Phone,
        RestDate: req.body.RestDate,
        MenuUrl: req.body.MenuUrl,
    });
    // function(err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.send(data);
    //         console.log("Store Profile Updated!");
    //     }
    // }
    edit.exec(function(err, data) {
        if (err) {
            throw err;
        } else {
            res.send(data);
            console.log("Store Profile Updated!");
        }
    })
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