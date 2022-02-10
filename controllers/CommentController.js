const mongoose = require('mongoose');
var Comment = require("../models/Comment");
const moment = require("moment");

exports.post = async (req, res) => {
    const date = new Date();
    const comment = new Comment({
        storeprofiles: req.body.storeprofiles,
        userprofiles: req.body.userprofiles,
        Comment: req.body.Comment,
        date: moment(date).format("YYYY/MM/DD hh:mm"),
    });
    // req.session.cart = cart;
    // session.user  = cart.user;
            
    comment
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                comment:
                    err.comment || "Some error occurred while posting the comment.",
            });
        });
};

exports.storeComment = (req, res) => {
    var storeId = mongoose.Types.ObjectId(req.params.storeId)

    Comment.aggregate([
        {   
            $match: {
                storeprofiles: { "$in":  [storeId] }  // 查詢條件
            }
        },
        {
            $lookup: {
                from: "userprofiles",
                localField:"userprofiles",
                foreignField:"_id",
                as: "User"
            }
        },
        {
            $group: {
                _id: "$storeprofiles",
                comment: { $push: "$$ROOT"}
            }
        },
        {
            $lookup: {
                from: "storeprofiles",
                localField:"comment.storeprofiles",
                foreignField:"_id",
                as: "Store"
            }
        },
        {
            $project: {
                _id: 0,
                Store: {
                    StoreName: 1
                },
                comment: {
                    Comment: 1,
                    User: {
                        UserName: 1,
                        NickName: 1
                    },
                    date: 1
                }
            }
        },
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data[0]);
        res.send(data[0])
    })
}