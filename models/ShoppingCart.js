const mongoose = require("mongoose");

const ShoppingCartSchema = new mongoose.Schema({
    userprofiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
    }],
    storeprofiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreProfile',
    }],
    bill: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
    }],
    Meals: [{
        type: Object,
        required: true,
    },],
    Price: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);