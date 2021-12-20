const express = require('express');
// const expressBusboy = require('express-busboy');

const app = express();
// expressBusboy.extend(app);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require("./config/mongoose")(app);

var corseOptions = {
    origin: "*",
    credentials: true,
};

// Data parsing
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json({limit: "50mb"}));
app.use(cookieParser());
app.use(cors(corseOptions));

app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.json({ message: "Server is running 😉"});
});
require("./routes/UserProfileRouter")(app);
require("./routes/StoreProfileRouter")(app);
require("./routes/ShoppingCartRouter")(app);
// require("./routes/MenuImageUploadRouter")(app);
// require("./routes/BillRouter")(app);

// Set port, Listen on server
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server is starting at ${PORT}`));