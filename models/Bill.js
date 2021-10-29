const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    TotalMeals: {
        type: Array,
        required: true,
    },
    TotalPrice: {
        type: Number,
        default: 0,
    }
});

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 bill 的 collection
module.exports = mongoose.model('Bill',BillSchema);