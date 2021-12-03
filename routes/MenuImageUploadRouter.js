module.exports = (app) => {
    const App = require("../controllers/MenuImageUploadController");
    const multerInstance = require("../config/multer")
    app.post("/images", multerInstance.upload.single('image'), App.create);
    app.get("/image/:storeId/:filename",App.findOne);
  };