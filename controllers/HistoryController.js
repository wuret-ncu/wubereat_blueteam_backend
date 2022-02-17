const History = require('../models/History');
exports.create = async (req, res) => {
    // console.log(req.session)
    // var session = req.session;
    const history = new History({
        Store: req.body.Store,
    });
    history.TotalList.push({
        User: req.body.UserName
    })
    history.TotalList.OrderList.push({
        Meals: req.body.Meals,
        Price: req.body.Price
    })
            
    history
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                history:
                    err.history || "Some error occurred while creating the History record.",
            });
        });
};