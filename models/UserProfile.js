const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserProfileSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            storeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StoreProfile',
                required: true,
            },
            meal: {
                type: Number,
                required: true
            },
        },],
    },
});

UserProfileSchema.plugin(passportLocalMongoose);
// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 userprofile 的 collection
module.exports = mongoose.model('UserProfile',UserProfileSchema);

UserProfileSchema.methods.addToCart = function (store) {
    const cartStoreIndex = this.cart.items.findIndex((cp) => {
        return cp.storeId.toString() === store._id.toString();
    });
    const updatedCartItems = [...this.cart.items];
    const updatedCart = {
        items: updatedCartItems,
    };
    this.cart = updatedCart;
    return this.save();
};