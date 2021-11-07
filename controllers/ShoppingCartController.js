const mongoose = require('mongoose');
var ShoppingCart = require('../models/ShoppingCart')

exports.create = (req, res) => {

    const cart = new ShoppingCart({
        userprofiles: req.body.userprofiles,
        storeprofiles: req.body.storeprofiles,
        bill: req.body.bill,
        Meals: req.body.Meals,
        Price: req.body.Price,
    });
            
    cart
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                cart:
                    err.cart || "Some error occurred while creating the Cart.",
            });
        });
};

exports.findAll = (req, res) => {
    
    ShoppingCart.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                cart:
                    err.cart || "Some error occurred while retrieving carts.",
            });
        });
};

exports.findOne = (req, res) => {
    ShoppingCart.findById(req.params.cartId)
        .then((data) => {
            if(!data) {
                return res.status(404),send({
                    cart: "Cart not found with id" + req.params.cartId,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "String") {
                return res.status(404).send({
                    cart: "Cart not found with id" + req.params.cartId,
                });
            }
            return res.status(500).send({
                cart: "Cart not found with id" + req.params.cartId,
            });
        });
};

exports.findFavorite = (req, res) => {
    var userId = mongoose.Types.ObjectId(req.params.userId)
    ShoppingCart.aggregate([
        // ↓ 顯示該用戶"點過的所有店家"並計算"次數" ↓ //
        {   
            $match: {
                userprofiles: { "$in":  [userId] }
            }
        },
        {
            $group: {
                _id: "$storeprofiles",
                Frequency: {"$sum": 1},
                storeprofiles: {"$first": "$storeprofiles"},
                userprofiles: {"$first": "$userprofiles"},
            }
        },
        {
            $lookup: {
                from: "userprofiles",
                localField:"userprofiles",
                foreignField:"_id",
                as: "User_info"
            }
        },
        {
            $lookup: {
                from: "storeprofiles",
                localField:"storeprofiles",
                foreignField:"_id",
                as: "Store_info"
            }
        },
        {
            "$unwind": {"path": "$storeprofiles"}
        },
        {
            "$unwind": {"path": "$userprofiles"}
        },
        // ↓ 將店家依被點的次數由大到小排序 ↓ //
        {
            $sort: { Frequency: -1 }
        },
        // ↓ 顯示最常被點的店家 ↓ //
        // {
        //     $limit: 1
        // },
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data)
    })
}
