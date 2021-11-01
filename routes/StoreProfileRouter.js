module.exports = (app) => {
  const App = require("../controllers/StoreProfileController");
  app.post("/createStore", App.create);
  app.get("/getAllStore", App.findAll);
  app.get("/store/:storeId", App.findOne);
  // app.put("/store/:storeId", App.update);
  // app.delete("/store/:storeId", App.delete);
};