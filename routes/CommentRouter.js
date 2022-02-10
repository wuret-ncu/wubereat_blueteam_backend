module.exports = (app) => {
    const App = require("../controllers/CommentController");
    
    app.post("/comments", App.post);
    app.get("/stores/:storeId/comment", App.storeComment);
}