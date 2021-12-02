const mongoose = require('mongoose');
const Bill = require("../models/Bill")

exports.findAll = (req, res) => {
    Bill.aggregate([
        {
            $lookup: {
                from: "shoppingcarts",
                localField: "shoppingcarts",
                foreignField: "Id",
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