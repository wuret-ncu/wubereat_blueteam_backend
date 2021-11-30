module.exports = (app) => {
  const App = require("../controllers/UserProfileController");
  app.post("/register", App.create);
  app.get("/user/:userId", App.findOne);
}