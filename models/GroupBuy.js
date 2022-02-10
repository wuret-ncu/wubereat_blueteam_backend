const mongoose = require("mongoose");
const moment = require("moment");
const { ObjectId } = require("mongodb");
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
const OrderListSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
    },
    // meal: {
    //     type: String
    // },
    // spend: {
    //     type: Number
    // },
    // date: {
    //     type: String,
    //     default: new Date(),
    //     get: v => moment(v).format('YYYY-MM-DD')
    // }
})
  
const GroupBuySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        require: true
    },
    groupBuyCode: {
        type: String,
        default: new Date(),
        // get: v => moment(v).format('MMDDhhmm')
    },
    orderList: [OrderListSchema]
}, schemaOptions);

// Compile Schema 變成 Model，如此可以透過這個 Model 建立和儲存 document
// 會在 mongo 中建立名為 bill 的 collection
// module.exports = mongoose.model('OrderList', OrderListSchema);
module.exports = mongoose.model('GroupBuy', GroupBuySchema);