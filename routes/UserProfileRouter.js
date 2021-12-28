module.exports = (app) => {
    const App = require("../controllers/UserProfileController");
    app.post("/register", App.register);
    app.post("/login", App.login);
    app.get("/user/:userId", App.findOne);
  }