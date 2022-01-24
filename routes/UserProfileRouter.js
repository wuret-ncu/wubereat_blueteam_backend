// 引用 passport
// const passport = require('passport')

module.exports = (app) => {
    const App = require("../controllers/UserProfileController");
    app.post("/register", App.register);
    // 加入 middleware，驗證 request 登入狀態
    app.post("/login", App.login
    // , 
    // passport.authenticate('local', {
    //   successRedirect: '/',
    //   failureRedirect: '/login'
    // })
    );
    app.get("/user/:userId", App.findOne);
    app.get("/logout", App.logout);
  }