module.exports = (app) => {
    const App = require("../controllers/ShoppingCartController");
    app.post("/carts", App.create);
    app.get("/carts", App.findAll);
    app.get("/cart/:cartId", App.findOne);
    app.get("/users/:userId/favorite", App.findFavorite);
    app.get("/bills", App.bill);
    app.delete("/:cartId", App.removeCart);
   
    // /user/<user_id>/favorite
    // /favorite -> my own all favorites
    // /favorite/<id>
    // /cart/<id>
}