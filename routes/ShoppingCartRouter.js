module.exports = (app) => {
    const App = require("../controllers/ShoppingCartController");
    app.post("/carts", App.create);
    app.get("/carts/drawer", App.drawer);
    app.get("/carts/history/:userId", App.history);
    app.get("/cart/:cartId", App.findOne);
    app.get("/users/:userId/favorite", App.findFavorite);
    app.get("/bill", App.bill);
    app.get("/bill/user", App.user);
    app.delete("/:cartId", App.removeCart);
   
    // /user/<user_id>/favorite
    // /favorite -> my own all favorites
    // /favorite/<id>
    // /cart/<id>
}