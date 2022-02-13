const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const GroupBuy = require("../models/GroupBuy");
const moment = require("moment");

exports.create = (req, res) => {
    var date = new Date();  // dateStr you get from mongodb
    // var d = date.getDate();
    // var m = date.getMonth()+1;
   const code = new GroupBuy({
        user: req.body.user,
        groupBuyCode: moment().format("MMDDmmss"),
    });
    code.orderList.push({
        member: req.body.user
    })
            
    code
        .save()
        .then((data) => {
            // moment(data.groupBuyCode).format('MMDDhhmm');
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

exports.addToGroup =async (req, res) => {
    const code = req.body.groupBuyCode;
    GroupBuy.findOne({groupBuyCode: code}, function (err,b) {
        if (err) throw err;
        b.orderList.push(req.body);
        b.save(function (err, batch) {
            if (err) throw err;
            console.log('Updated orderList!');
            res.json(batch);
        })
    })
    if (Array.isArray(GroupBuy.orderList)) {
        GroupBuy.orderList.push(req.body);
    } else {
        GroupBuy.orderList = [req.body];
    }
}

exports.findAll = (req, res) => {
    // var billId = mongoose.Types.ObjectId("61bab569bbafd8e75ce10ca9")
    console.log(req.params.id)
    GroupBuy.find({"groupBuyCode": req.params.id}, {_id: 0, user: 1}).populate({path: 'user', select: 'UserName-_id'})
    .then((data) => {
        if(!data) {
            return res.status(404),send({
                cart: "Not found.",
            });
        }
        res.send(data);
    })
    .catch((err) => {
        if (err.kind === "String") {
            return res.status(404).send({
                cart: "Not found.",
            });
        }
        return res.status(500).send({
            cart: "Not found.",
        });
    });
}

exports.leaveGroup = (req, res) => {
    GroupBuy.deleteOne({ groupBuyCode: req.params.id },
        function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.send(data);
                console.log("Store Deleted!");
            }
        });
}