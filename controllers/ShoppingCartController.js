const mongoose = require('mongoose');
var ShoppingCart = require('../models/ShoppingCart')

exports.create = (req, res) => {
    const billId = '123';
    const cart = new ShoppingCart({
        userprofiles: req.body.userprofiles,
        storeprofiles: req.body.storeprofiles,
        bill: billId,
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
    let userId = '617b866fb32fcc5a5855e95c';
    // let userId = req.cookies.userId;
    ShoppingCart.find({userId})
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
            "$unwind": "$storeprofiles"
        },
        {
            "$unwind": "$userprofiles"
        },
        // ↓ 將店家依被點的次數由大到小排序 ↓ //
        {
            $sort: { Frequency: -1 }
        },
        // ↓ 顯示最常被點的店家 ↓ //
        // {
        //     $limit: 1
        // },
        {
            $project: {
                Store_info: {
                    StoreName: 1
                },
                User_info: {
                    UserName: 1
                },
                Frequency: 1
            }
        }
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data)
    })
}

exports.bill = (req, res) => {
    ShoppingCart.aggregate([
        {
            $group: {
                _id: {
                  "$toDate": {
                    "$subtract": [
                      { "$toLong": { "$toDate": "$_id" }  },
                      { "$mod": [ { "$toLong": { "$toDate": "$_id" } }, 1000 * 60 * 15 ] }  // group result by 15 mins time interval in the shoppingcart.
                    ]
                  }
                },
                count: { "$sum": 1 },
                Total: {
                    $sum: "$Price"
                },
                Meals: {
                    $push: "$Meals"
                },
                Price: {
                    $push: "$Price"
                }
              }
        },
        {
            $project: {
                _id: 0,
                Meals: 1,
                Price: 1,
                Total: 1,
                FormattedDate: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$_id" } } 
            }
        },
        {
            $sort: { FormattedDate: -1 }    // 使用日期遞減的方式排列（時間點離目前時間越近的越前面）
        },
        {
            $limit: 1   // 只取出第一筆
        }
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data)
    })
}

exports.removeCart = async (req, res) => {
    ShoppingCart.findByIdAndDelete(req.params.cartId)
    .then((data) => {
        if(!data) {
            return res.status(404),send({
                cart: "Cart not found with id " + req.params.cartId,
            });
        }
        res.send("Cart id: " + req.params.cartId + " is deleted! "  + data);
    })
    .catch((err) => {
        if (err.kind === "String") {
            return res.status(404).send({
                cart: "Cart not found with id " + req.params.cartId,
            });
        }
        return res.status(500).send({
            cart: "Cart not found with id " + req.params.cartId,
        });
    });
}