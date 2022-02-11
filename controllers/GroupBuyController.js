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
        groupBuyCode: moment().format("MMDDhhmm"),
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
//     const m = req.body.groupBuyCode
//    GroupBuy.findOne({m})
//     togroup
//     .save()
//         .then((data) => {
            
//             // data.user = user._id,
//             res.send(data);
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 bill:
//                     err.bill || "Some error occurred while creating the GroupBuy.",
//             });
//         });
    // var order = {
    //     $push: {
    //         "orderList": {
    //             member: req.body.member,
    //             // meal: req.body.meal,
    //             // spend: req.body.spend
    //         }
    //     }
    // }
    // const code = moment.utc(req.body.groupBuyCode);
    // GroupBuy.find(req.body.groupBuyCode)
    //     .then((data) => {
    //         var member = req.body.orderList.member;
    //         for(var i=0; i<data.orderList.length; i++)
    //             data.orderList[i].member = mongoose.Types.ObjectId(data.orderList[i].member)
    //         member = mongoose.Types.ObjectId(member);
            
    //     })
    // const gp = await GroupBuy.findOne({groupBuyCode: req.body.groupBuyCode})
    // const orderList = gp.orderList
    // console.log(GroupBuy.user)
    // res.send(gp)
    // gp.orderList.push({
    //     member: req.body.member
    // })
    //     .then((data) => {
    //         if(!data) {
    //             return res.status(404),send({
    //                 cart: "Cart not found with id" + req.params.cartId,
    //             });
    //         }
    //         res.send(data);
    //     })
    //     .catch((err) => {
    //         if (err.kind === "String") {
    //             return res.status(404).send({
    //                 cart: "Cart not found with id" + req.params.cartId,
    //             });
    //         }
    //         return res.status(500).send({
    //             cart: "Cart not found with id" + req.params.cartId,
    //         });
    //     });
    // const g = req.body.groupBuyCode;
    const code = req.body.groupBuyCode;
    // console.log(moment(code))
    GroupBuy.findOne({groupBuyCode: code}, function (err,b) {
        if (err) throw err;
        b.orderList.push(req.body);
        // const a = req.body.orderList;
        // for(i=0; i< a.length; i++) {
            // b.orderList.push(req.body.orderList[i]);
        // }
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