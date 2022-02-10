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
var corseOptions = {
    origin: "*",
    credentials: true,
};
app.use(cors(corseOptions));

require("./config/mongoose")(app);

// Add the Express-session options
// creating 24 hours from milliseconds
// const oneDay = 1000 * 60 * 60 * 24;
 
// cookie parser middleware
app.use(cookieParser('thisismysecrctekeyfhrgfgrfrty84fwir767'));

// session middleware
app.use(session({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',    // 用來簽名存放在cookie的sessionID
    // name: 'user',
    // store: new FileStore(),
    // cookie: { maxAge: oneDay },
    saveUninitialized: false,    // 設定為false可以避免存放太多空的session進入session store, session在還沒被修改前也不會被存入cookie
    resave: false,    // 因為每個session store會有不一樣的配置，有些會定期去清理session，如果不想要session被清理掉的話，就要把這個設定為true
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


app.get('/', (req, res) => {

    // 用console log來觀察這些變數
    console.log(req.session)    // 透過req.session這個變數來取得session內容
    console.log(req.sessionID)   // req.sessionID來取得session ID
    
    res.json({ message: "Server is running 😉"});
});

// 掛載 middleware
const { authenticator } = require('./middleware/auth')
require("./routes/UserProfileRouter")(app, authenticator);
require("./routes/StoreProfileRouter")(app);
require("./routes/ShoppingCartRouter")(app);
require("./routes/GroupBuyRouter")(app);
require("./routes/ScoreRouter")(app);

// Listen on server
app.listen(PORT, console.log(`Server is running at ${PORT}`));