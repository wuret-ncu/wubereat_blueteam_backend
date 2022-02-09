module.exports = (app) => {
    const App = require("../controllers/GroupBuyController")
    app.post("/groupbuy", App.create);
    app.post("/addtogroup", App.addToGroup);
    app.get("/bills",App.findAll);
}