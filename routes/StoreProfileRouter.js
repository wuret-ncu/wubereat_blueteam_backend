module.exports = (app) => {
  function auth(req, res, next) {
    if (req.session.user) {
    console.log('authenticated')
    next()
    } else {
    console.log('not authenticated')
    return res.redirect('/login')
    }
  }
    const App = require("../controllers/StoreProfileController");
    const multerInstance = require("../config/multer");
    app.post("/stores", multerInstance.upload.single('image'), App.create); // 接收至多 12 個名為 Avatar 欄位的檔案
    app.get("/stores", App.findAll);
    app.get("/store/:storeId", auth, App.findOne);
    app.get("/stores/:type", auth,App.findType);
    app.post("/store/:storeId", auth, App.update);
    app.delete("/store/:storeId", auth, App.delete);
  };