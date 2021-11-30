module.exports = (app) => {
  const App = require("../controllers/StoreProfileController");
  app.post("/stores", App.create);
  app.get("/stores", App.findAll);
  app.get("/store/:storeId", App.findOne);
  app.get("/stores/:type",App.findType);
  // app.put("/store/:storeId", App.update);
  // app.delete("/store/:storeId", App.delete);
};