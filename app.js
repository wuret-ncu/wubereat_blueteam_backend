const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require("./config/mongoose")(app);

console.log("test 1");
// Data parsing
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors());

console.log("test 2");
app.get('/', (req, res) => {
    res.json({ message: "Server is running 😉"});
});
require("./routes/UserProfileRouter")(app);
require("./routes/StoreProfileRouter")(app);
require("./routes/ShoppingCartRouter")(app);

// Set port, Listen on server
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server is starting at ${PORT}`));