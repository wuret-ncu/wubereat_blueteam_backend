module.exports = (app) => {
    const App = require("../controllers/ScoreController");
    
    app.post("/scores", App.post);
    app.get("/stores/:storeId/score", App.storeScore);
}