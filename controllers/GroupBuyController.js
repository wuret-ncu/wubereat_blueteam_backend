const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const GroupBuy = require("../models/GroupBuy")

exports.create = (req, res) => {
    // var billId = "61bb05860d7cbb0604416f4d"
    const bill = new GroupBuy({
        shoppingcarts: req.body.shoppingcarts
    });
            
    bill
        .push()
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
    // var billId = mongoose.Types.ObjectId("61bab569bbafd8e75ce10ca9")
    GroupBuy.aggregate([
        {
            $match: {
                billId: ObjectId("61baaf91155f64ef7aee51eb")
            }
        },
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
                shoppingcarts: { 
                    $push: { "$first": "$shoppingcarts" }
                },
            }
        },
        {
            $lookup: {
                from: "shoppingcarts",
                localField:"shoppingcarts",
                foreignField:"_id",
                as: "Carts_info"
            }
        },
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data)
    })
}