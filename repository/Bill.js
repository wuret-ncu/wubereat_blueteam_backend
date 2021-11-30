var Bill = require('../models/Bill');

exports.bill = async() => {
    const bills = await Bill.find.populate({
        path: "shoppingcarts.ObjectId",
        select: "UserName StoreName Meals Price"
    });
    return bills[0];
};

exports.addCart = async payload => {
    const newCart = await Bill.create(payload);
    return newCart
}