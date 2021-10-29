const bodyParser = require('body-parser');
const logger = require('morgan');
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
const UserProfile = require('./models/UserProfile');
require("./config/mongoose")(app);

var app = express();

// const port = 8080;
const PORT = process.env.PORT || 8080;

// Data parsing
app.use(logger('dev'));
app.use(express.json());    // Express 內建的 middleware 拿到前端的表單及 JSON 資料


if(process.env.NOED_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.listen(PORT, console.log(`Server is starting at ${PORT}`));

app.use(require("express-session")({
  secret: "Any normal Word",
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(UserProfile.serializeUser());  //session encoding
passport.deserializeUser(UserProfile.deserializeUser());  //session decoding
passport.use(new LocalStrategy(UserProfile.authenticate()));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(passport.initialize());
app.use(passport.session());


app.get("/login", isLoggedIn, (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});