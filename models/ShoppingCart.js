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
    Meals: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        default: 0,
    },
    Date: {
        type: Date,
        required: true,
    }
});

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 shoppingcart 的 collection
module.exports = mongoose.model('ShoppingCart',ShoppingCartSchema);