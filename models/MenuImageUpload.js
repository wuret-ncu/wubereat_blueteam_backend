const mongoose = require("mongoose");

const MenuImageUploadSchema = new mongoose.Schema({
    storeId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreProfile',
        required: true,
    }],
    image: { 
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 menuimageupload 的 collection
module.exports = mongoose.model('MenuImageUpload',MenuImageUploadSchema);