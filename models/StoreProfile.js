const mongoose = require("mongoose");
require('mongoose-type-url');

let StoreProfileSchema = new mongoose.Schema({
    MenuImageUpload: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuImageUpload'
    },
    StoreType: [{
        type: Array,
        enum: ["Foods", "Drinks"],
        default: "Foods"
    }],
    StoreName: {
        type: String,
        required: true,
    },
    // MenuUrl: {
    //     work: mongoose.SchemaType.Url,
    //     profile: mongoose.SchemaType.Url
    // },
    Phone: {
        type: Number,
    },
    RestDate: [{
        type: Array,
    }],
    MenuUrl: {
        type: String,
    },
    image: {
        type: String
    }
    // AverageScore: {
    //     type: Number,
    // }
});

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 storeprofile 的 collection
module.exports = mongoose.model('StoreProfile',StoreProfileSchema);