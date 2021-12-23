const ShoppingCart = require('../models/ShoppingCart');

exports.cart = async() => {
    const carts = await ShoppingCart.find.populate({
        path: "order.userprofiles order.storeprofiles",
        select: "UserName StoreName"
    });
    return carts[0];
};

exports.addOrder = async payload => {
    const newOrder = await ShoppingCart.create(payload);
    return newOrder
}