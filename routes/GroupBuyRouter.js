module.exports = (app) => {
    const App = require("../controllers/GroupBuyController")
    app.post("/groupbuy", App.create);
    // app.post("/addtogroup", App.addToGroup);
    app.get("/groupmembers/:id",App.findAll);
    app.get("/group/:id", App.leaveGroup);
}