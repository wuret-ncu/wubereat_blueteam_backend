const mongoose = require('mongoose');
const Bill = require("../models/Bill")

exports.create = async (req, res) => {
    const bill = [] 
    bill.push({
        shoppingcarts: req.body.shoppingcarts,
    });
    bill
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                bill:
                    err.bill || "Some error occurred while creating the Bill.",
            });
        });
}

exports.findAll = (req, res) => {
    Bill.aggregate([
        {
            $lookup: {
                from: "shoppingcarts",
                localField: "shoppingcarts",
                foreignField: "_id",
                as: "ShoppingCart_info"
            }
        },
        // {
        //     $unwind: "$shoppingcarts"
        // },
        {
           $project: {
                ShoppingCart_info: {
                   Meals: 1,
                   Price: 1
               },
                "TotalSpend": { "$sum": "$ShoppingCart_info.Price" }
           }
        }
    ])
    .exec((err, data) => {
        if(err) throw err;
        console.log(data);
        res.send(data)
    })
}