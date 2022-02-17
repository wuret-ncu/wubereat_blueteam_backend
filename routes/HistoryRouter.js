module.exports = (app) => {
    const App = require("../controllers/HistoryController");
    app.post("/history", App.create);
}