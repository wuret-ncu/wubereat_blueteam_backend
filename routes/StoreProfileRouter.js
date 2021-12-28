module.exports = (app) => {
    const App = require("../controllers/StoreProfileController");
    const multerInstance = require("../config/multer");
    app.post("/stores", multerInstance.upload.single('Image'), App.create);
    app.get("/stores", App.findAll);
    app.get("/store/:storeId/:filename", App.findOne);
    app.get("/stores/:type",App.findType);
    app.post("/store/:storeId", App.update);
    app.delete("/store/:storeId", App.delete);
  };