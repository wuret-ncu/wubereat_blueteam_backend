const mongoose = require("mongoose");

let ShoppingCartSchema = new mongoose.Schema({
    userprofiles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        // index: true,    // 實現「各使用者看到的是各自的畫面」功能 (把欄位設成索引，增加讀取效能)
        required: true,
    },
    storeprofiles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreProfile',
        required: true,
    },
    Meals: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        default: 0,
    }
    
}, {
    timestamps: true
});
module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);