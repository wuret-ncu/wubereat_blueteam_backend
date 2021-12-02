const Bill = require('../models/Bill');

exports.bill = async() => {
    const bills = await Bill.find.populate({
        path: "shoppingcart",
        select: "StoreName"
    });
    return bills[0];
};

exports.addCart = async payload => {
    const newCart = await Bill.create(payload);
    return newCart
}