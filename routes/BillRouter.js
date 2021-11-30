module.exports = (app) => {
    const App = require("../controllers/BillController")
    app.post("/bills", App.create);
    app.get("/bills",App.findAll);
}