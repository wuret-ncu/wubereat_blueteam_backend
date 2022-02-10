const mongoose = require("mongoose");

const schemaOptions = {
    toObject: {
      getters: true,
      virtuals: true,
      versionKey: false,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    },
    toJSON: {
      getters: true,
      virtuals: true,
      versionKey: false,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    },
    runSettersOnQuery: true,
};
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
    },
    date: {
        type: String,
        default: new Date()
    }
}, schemaOptions);

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 comment 的 collection
module.exports = mongoose.model('Comment',CommentSchema);