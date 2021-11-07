var mongoose =  require('mongoose');

const { MongoClient, MongoParseError } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://Ru:0918@cluster0.jpcuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(url);

mongoose.Promise = global.Promise;
var db = mongoose.connect;

db.once('error', console.error.bind(console, 'MongoDB connection error:'));