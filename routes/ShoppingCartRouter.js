module.exports = (app) => {
    const App = require("../controllers/ShoppingCartController");
    app.post("/bills/:userId/ShoppingCarts", App.create);
    app.get("/getAllCart", App.findAll);
    app.get("/cart/:cartId", App.findOne);
}