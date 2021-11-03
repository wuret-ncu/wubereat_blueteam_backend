var ShoppingCart = require('../models/ShoppingCart');

exports.cart = async() => {
    const carts = await ShoppingCar.find.populate({
        path: "ShoppingCarts",
        select: "Meals-id"
    });
    return carts[0];
};

exports.addMeal = async payload => {
    const newMeal = await ShoppingCart.create(payload);
    return newMeal
}