const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const GroupBuy = require("../models/GroupBuy");
const moment = require("moment")

exports.create = (req, res) => {
    var date = new Date();  // dateStr you get from mongodb
    // var d = date.getDate();
    // var m = date.getMonth()+1;
   const code = new GroupBuy({
        user: req.body.user,
        groupBuyCode: date
    });
            
    code
        .save()
        .then((data) => {
            
            // data.user = user._id,
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                bill:
                    err.bill || "Some error occurred while creating the GroupBuy.",
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