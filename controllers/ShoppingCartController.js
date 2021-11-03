var ShoppingCart = require('../models/ShoppingCart')
var StoreProfile = require('../models/StoreProfile')
var UserProfile = require('../models/UserProfile')

function cartsIndex(req, res) {
    ShoppingCart.find(function(err, carts) {
        if (err) res.json({ message: 'There are no carts here.'});
        ShoppingCart.find({})
            .populate('userprofiles')
            .populate('storeprofiles')
            .exec(function(err, carts) {
                res.render("carts/index", { carts: carts });
            })
    });
}

exports.create = (req, res) => {
    const billId = req.body.billId;
    const userId = req.body.userId;
    const storeId = req.body.storeId;
    const params = {
        billId, userId, storeId
    };

    const store = new StoreProfile({
        StoreName: req.body.StoreName,
    });

    const cart = new ShoppingCart({
        Meals: req.body.Meals,
        Price: req.body.Price,
    });

    // user
    //     .save()
    //     .then((data) => {
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             user:
    //                 err.user || "Some error occurred while creating the Cart.",
    //         });
    //     });
    
    // store
    //     .save()
    //     .then((data) => {
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             store:
    //                 err.store || "Some error occurred while creating the Cart.",
    //         });
    //     });
            
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
    // UserProfile.find()
    //     .then((data) => {
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             user:
    //                 err.user || "Some error occurred while retrieving carts.",
    //         });
    //     });
    
    // StoreProfile.find()
    //     .then((data) => {
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         res.status(500).send({
    //             store:
    //                 err.store || "Some error occurred while retrieving carts.",
    //         });
    //     });
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
                    store: "Cart not found with id" + req.params.cartId,
                });
            }
            return res.status(500).send({
                store: "Cart not found with id" + req.params.cartId,
            });
        });
};