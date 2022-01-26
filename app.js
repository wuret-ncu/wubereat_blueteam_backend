// Import all the Node.js libraries
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
// 載入設定檔，引用 passport 模組
const usePassport = require('./config/passport')


// Initialize the express app
const app = express();
const PORT = process.env.PORT || 8080;

require("./config/mongoose")(app);

// Add the Express-session options
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

// session middleware
var identityKey = 'skey';
app.use(session({
    name: identityKey,
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    store: new FileStore(),
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: true,
}))


// 呼叫 Passport 函式並傳入 app
usePassport(app)

app.use((req, res, next) => {
    // 把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
    res.locals.isAuthenticated = req.isAuthenticated() 
    // 反序列化時取得的 user 資訊
    res.locals.user = req.user
    next()
  })


var corseOptions = {
    origin: "*",
    credentials: true,
};
app.use(cors(corseOptions));


// Parse the HTML form
// parsing the incoming data
app.use(express.json({ limit: "1mb" }));
// Data parsing
app.use(express.urlencoded({ 
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
})); 

app.use(bodyParser.json({limit: "50mb"}));

// serving public file
app.set("views", path.resolve(__dirname, "views"));
app.set("images", path.resolve(__dirname, "images"));
app.set("view engine", "ejs");
app.use('/images', express.static('images'));

// cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({ message: "Server is running 😉"});
});

// 掛載 middleware
const { authenticator } = require('./middleware/auth')
require("./routes/UserProfileRouter")(app, authenticator);
require("./routes/StoreProfileRouter")(app, authenticator);
require("./routes/ShoppingCartRouter")(app, authenticator);

// Listen on server
app.listen(PORT, console.log(`Server is running at ${PORT}`));