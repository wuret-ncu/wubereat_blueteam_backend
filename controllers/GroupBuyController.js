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
    code.members.push({
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
        b.members.push(req.body);
        b.save(function (err, batch) {
            if (err) throw err;
            console.log('Updated orderList!');
            res.json(batch);
        })
    })
    if (Array.isArray(GroupBuy.members)) {
        GroupBuy.members.push(req.body);
    } else {
        GroupBuy.members = [req.body];
    }
}

exports.findAll = (req, res) => {
    // var billId = mongoose.Types.ObjectId("61bab569bbafd8e75ce10ca9")
    // console.log(req.params.id)
    GroupBuy.find({"groupBuyCode": req.params.id},{_id: 0, user: 0, groupBuyCode: 0}).populate({path: 'members', select: '-_id', populate: { path: 'member', select: 'NickName-_id'}})
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
    console.log("delete!!")
    GroupBuy.updateOne({"groupBuyCode": req.params.id}, {$pull: { "members": { "member": req.params.memberId } } })
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data);
    });
}