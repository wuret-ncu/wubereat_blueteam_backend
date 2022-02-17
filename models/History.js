const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    Meals: {
        type: String
    },
    Price: {
        type: Number
    }
})

const OrderSchema = new mongoose.Schema({
    User: {
        type: String
    },
    OrderList: [ListSchema]
})

const HistorySchema = new mongoose.Schema({
    Store: {
        type: String
    },
    TotalList: [OrderSchema]
}, {
    timestamps: true
});
module.exports = mongoose.model('History', HistorySchema);