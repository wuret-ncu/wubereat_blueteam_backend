const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("./config/mongoose")(app);

console.log("test 1");
// Data parsing
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
console.log("test 2");
app.get('/', (req, res) => {
    res.json({ message: "Server is running 😉"});
});


// Set port, Listen on server
const PORT = process.env.PORT || 8080;
require("./routes/StoreProfileRouter")(app);
app.listen(PORT, console.log(`Server is starting at ${PORT}`));