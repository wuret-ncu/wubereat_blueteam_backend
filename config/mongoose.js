const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = app => {
    const uri = "mongodb+srv://Ru:0918@cluster0.jpcuv.mongodb.net/WUbeREaT?retryWrites=true&w=majority";
    mongoose
    .connect(uri, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      console.log("Connected to the database!");
    })
    .catch(err => {
      console.log("Cannot connect to the database...", err);
      process.exit();
    })
}

// mongoose.connection.on('connected', () => {
//   console.log('Mongoose is connected!!!');
// });