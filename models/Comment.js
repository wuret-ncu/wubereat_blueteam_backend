const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userprofiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
    }],
    storeprofiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreProfile',
    }],
    Comment: {
        type: String,
        required: true,
    }
});

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 comment 的 collection
module.exports = mongoose.model('Comment',CommentSchema);