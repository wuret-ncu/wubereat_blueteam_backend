const express = require('express');
const app = express();

const session = require('express-session');
app.use(session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true
}))

// 載入設定檔
const usePassport = require('./config/passport')
// 呼叫 Passport 函式並傳入 app
usePassport(app)

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require("./config/mongoose")(app);

var corseOptions = {
    origin: "*",
    credentials: true,
};
app.use(cors(corseOptions));

// Data parsing
app.use(express.urlencoded({ 
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
})); 
app.use(bodyParser.json({limit: "50mb"}));
app.use(cookieParser());

app.use('/images', express.static('images'));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.json({ message: "Server is running 😉"});
});
require("./routes/UserProfileRouter")(app);
require("./routes/StoreProfileRouter")(app);
require("./routes/ShoppingCartRouter")(app);

// Set port, Listen on server
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server is running at ${PORT}`));