module.exports = (app) => {
    const App = require("../controllers/StoreProfileController");
    const multerInstance = require("../config/multer");
    app.post("/stores", multerInstance.upload.single('image'), App.create); // 接收至多 12 個名為 Avatar 欄位的檔案
    app.get("/stores", App.findAll);
    app.get("/store/:storeId", App.findOne);
    app.get("/stores/:type", App.findType);
    app.post("/store/:storeId", App.update);
    app.delete("/store/:storeId", App.delete);
  };