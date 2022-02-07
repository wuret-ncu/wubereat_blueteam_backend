module.exports = (app) => {
    const App = require("../controllers/GroupBuyController")
    app.post("/bills", App.create);
    app.get("/bills",App.findAll);
}