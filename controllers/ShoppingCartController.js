const session = require('express-session');
const mongoose = require('mongoose');
var ShoppingCart = require('../models/ShoppingCart')

exports.create = async (req, res) => {
    console.log(req.session)
    var session = req.session;
    const cart = new ShoppingCart({
        storeprofiles: req.body.storeprofiles,
        userprofiles: req.body.userprofiles,
        Meals: req.body.Meals,
        Price: req.body.Price
    });
    // req.session.cart = cart;
    // session.user  = cart.user;
            
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

exports.drawer = (req, res) => {
    let currentDate = new Date();   // 取得現在的日期＆時間
    currentDate.setHours(currentDate.getHours()-1);     // 將現在時間減一小時
    // var userId = mongoose.Types.ObjectId('617b866fb32fcc5a5855e95c')
    const userId = req.session.user._id    // 變數設定
    console.log(req.session.user._id)
    ShoppingCart.aggregate([
        // ↓ 顯示該用戶的點餐歷史紀錄 ↓ //
        {   
            $match: {
                userprofiles: { "$in":  [userId] }  // 查詢條件
            }
        },
        {
            $match: {
                createdAt: { $gte: currentDate }
            }
        },
        {
            $group: {
                _id: "",
                Order: { $push: "$$ROOT"},
            }
        },
        {
            $unwind: "$Order"
        },
        {
            $lookup: {
                from: "storeprofiles",
                localField:"Order.storeprofiles",
                foreignField:"_id",
                as: "Store_info"
            }
        },
        {
            $unwind: "$Store_info"
        },
        {
            $group: {
                _id: '',
                List: {
                    $push: {
                        Store: "$Store_info",
                        Order: "$Order",
                    }
                },
                Total: { $sum: "$Order.Price"},
            }
        },
        {
            $project: {
                _id: 0,
                List: {
                    Order: {
                        Meals: 1,
                        Price: 1
                    },
                    Store: {
                        StoreName: 1
                    }
                },
                Total: 1
            }
        },
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data[0]);
        res.send(data[0])
    })
};

exports.history = (req, res) => {
    // const user = ShoppingCart.find({User})
    const userId = req.session.User    // 變數設定
    // var userId = mongoose.Types.ObjectId(req.params.userId)
    ShoppingCart.aggregate([
        // ↓ 顯示該用戶的點餐歷史紀錄 ↓ //
        {   
            $match: {
                userprofiles: { "$in":  [userId] }
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
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                _id: 0,
                Meals: 1,
                Price: 1,
                User_info: {
                    UserName: 1
                },
                Store_info: {
                    StoreName: 1
                }
            }
        }
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data)
    })
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
    const userId = req.session.User    // 變數設定
    // var userId = mongoose.Types.ObjectId(req.params.userId)
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

exports.bill = async (req, res) => {
    let currentDate = new Date();   // 取得現在的日期＆時間
    currentDate.setHours(currentDate.getHours()-1);     // 將現在時間減一小時
    ShoppingCart.aggregate([
        {
            $match: {
                createdAt: { $gte: currentDate }
            }
        },
        {
            $group: {
                _id: {"userprofiles": "$userprofiles"},
                OrderList: {"$push": "$$ROOT"},
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
            $unwind: "$OrderList"
        },
        {
            $group: {
                _id: {"store":"$OrderList.storeprofiles"},
                TotalList: {"$push": "$$ROOT"},
                storeprofiles: {"$first": "$OrderList.storeprofiles"},
                // storeprofiles: {"$first": "$storeprofiles"},
                // userprofiles: {"$first": "$userprofiles"},
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
            $project: {
                _id: 0,
                TotalList: {
                    OrderList: {
                        Meals: 1,
                        Price: 1
                    },
                    User_info: {
                        UserName: 1
                    }
                },
                Store_info: {
                    StoreName: 1,
                    Phone: 1
                },
            }
        },
        // {
        //     $project: {
        //         _id: 0,
        //         TotalList: 1,
        //         Store_info: {
        //             StoreName: 1
        //         }
        //     }
        // },
    ])
    .exec()   // 取得離現在時間一個小時內的資料，並顯示店名與點餐者名字
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            cart:
                err.cart || "Some error occurred while retrieving carts.",
        });
    });
}

exports.user = (req, res) => {
    let currentDate = new Date();   // 取得現在的日期＆時間
    currentDate.setHours(currentDate.getHours()-1);     // 將現在時間減一小時
    ShoppingCart.aggregate([
        {
            $match: {
                createdAt: { $gte: currentDate }
            }
        },
        {
            $group: {
                _id: "$userprofiles",
                userprofiles: {"$first": "$userprofiles"}
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
            $project: {
                _id: 0,
                User_info: {
                    UserName: 1
                }
            }
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