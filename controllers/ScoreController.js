const mongoose = require('mongoose');
var Score = require("../models/Score");

exports.post = async (req, res) => {
    const score = new Score({
        storeprofiles: req.body.storeprofiles,
        userprofiles: req.body.userprofiles,
        Score: req.body.Score
    });
    // req.session.cart = cart;
    // session.user  = cart.user;
            
    score
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                score:
                    err.score || "Some error occurred while posting the score.",
            });
        });
};

exports.storeScore = (req, res) => {
    var storeId = mongoose.Types.ObjectId(req.params.storeId)

    Score.aggregate([
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
                score: { $push: "$$ROOT"},
                avgScore: { $avg: "$Score"}
            }
        },
        {
            $lookup: {
                from: "storeprofiles",
                localField:"score.storeprofiles",
                foreignField:"_id",
                as: "Store"
            }
        },
        {
            $project: {
                _id: 0,
                score: {
                    Score: 1,
                    User: {
                        UserName: 1
                    }
                },
                Store: {
                    StoreName: 1
                },
                avgScore: 1
            }
        },
    ])
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data[0]);
        res.send(data[0])
    })
}