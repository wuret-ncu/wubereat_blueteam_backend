const GroupBuy = require("../models/GroupBuy");
const moment = require("moment");

exports.create = (req, res) => {
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
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                group:
                    err.group || "Some error occurred while creating the Group Buy.",
            });
        });
}

exports.addToGroup =async (req, res) => {
    GroupBuy.findOne({ groupBuyCode: req.body.groupBuyCode }, function (err,data) {
        if (err) throw err;
        data.members.push(req.body);
        data.save(function (err, data) {
            if (err) throw err;
            console.log('Add the member to group!');
            res.json(data);
        })
    })
    if (Array.isArray(GroupBuy.members)) {
        GroupBuy.members.push(req.body);
    } else {
        GroupBuy.members = [req.body];
    }
}

exports.findAll = (req, res) => {
    GroupBuy.find({ "groupBuyCode": req.params.id }, { _id: 0, user: 0, groupBuyCode: 0 }).populate({ path: 'members', select: '-_id', populate: { path: 'member', select: 'NickName-_id' } })
    .then((data) => {
        if(!data) {
            return res.status(404),send({
                member: "Not found.",
            });
        }
        res.send(data);
    })
    .catch((err) => {
        if (err.kind === "String") {
            return res.status(404).send({
                member: "Not found.",
            });
        }
        return res.status(500).send({
            member: "Not found.",
        });
    });
}

exports.memberLeaveGroup = (req, res) => {
    GroupBuy.updateOne({ "groupBuyCode": req.params.id }, { $pull: { "members": { "member": req.params.memberId } } })
    .exec((err, data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data);
    });
}

exports.headOfTheGroupLeave = (req, res) => {
    GroupBuy.findOneAndDelete((req.params.leaderId),
    function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
            console.log("Group Deleted!");
        }
    });
}