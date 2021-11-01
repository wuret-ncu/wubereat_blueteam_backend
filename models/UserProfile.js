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
    TotalSpend: {
        type: Number,
        default: 0,
    }
});

UserProfileSchema.plugin(passportLocalMongoose);
// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 userprofile 的 collection
module.exports = mongoose.model('UserProfile',UserProfileSchema);