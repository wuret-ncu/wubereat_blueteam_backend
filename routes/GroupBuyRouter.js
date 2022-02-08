module.exports = (app) => {
    const App = require("../controllers/GroupBuyController")
    app.post("/groupbuy", App.create);
    app.get("/bills",App.findAll);
}