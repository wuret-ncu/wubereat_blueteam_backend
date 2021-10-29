const mongoose = require('mongoose');

module.exports = app => {
    const uri = "mongodb+srv://Ru:0918@cluster0.jpcuv.mongodb.net/WUbeREaT?retryWrites=true&w=majority";
    mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(res => console.log("connected~")).catch(err => console.log(err))
    mongoose.Promise = global.Promise;
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("SIGHUP", cleanup);
    if(app) {
    app.set("mongoose", mongoose);
    }
}

function cleanup() {
  mongoose.connection.close(function() {
    process.exit(0);
  });
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!!!');
});