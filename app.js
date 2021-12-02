const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require("./config/mongoose")(app);

// Data parsing
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.json({ message: "Server is running 😉"});
});
require("./routes/UserProfileRouter")(app);
require("./routes/StoreProfileRouter")(app);
require("./routes/ShoppingCartRouter")(app);
require("./routes/MenuImageUploadRouter")(app);
require("./routes/BillRouter")(app);

// Set port, Listen on server
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server is starting at ${PORT}`));