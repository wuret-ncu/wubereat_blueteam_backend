const mongoose = require("mongoose");

const MealPictureUploadSchema = new mongoose.Schema({
    userprofiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
    }],
    storeprofiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreProfile',
    }],
    PictureName: {
        type: String,
        required: true,
    },
    PictureUrl: {
        work: mongoose.SchemaType.Url,
        profile: mongoose.SchemaType.Url
    }
});

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 mealpictureupload 的 collection
module.exports = mongoose.model('MealPictureUpload',MealPictureUploadSchema);