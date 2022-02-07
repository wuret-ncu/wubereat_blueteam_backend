// 引用 passport
const passport = require('passport')

module.exports = (app) => {
    const App = require("../controllers/UserProfileController");
    const { authenticator } = require('../middleware/auth')
    app.get("/register", App.getregister);
    app.post("/register", App.register);
    app.get("/login", App.getlogin);
    // 加入 middleware，驗證 request 登入狀態
    app.post("/login", App.login, passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
    );
    app.get("/user", authenticator, App.findOne);
    app.get("/logout", App.logout);
  }