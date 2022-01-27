module.exports = (app) => {
    function auth(req, res, next) {
      if (req.session.User) {
      console.log('authenticated')
      next()
      } else {
      console.log('not authenticated')
      return res.redirect('/login')
      }
    }
    const App = require("../controllers/ShoppingCartController");
    app.post("/carts", auth, App.create);
    app.get("/carts/drawer", auth, App.drawer);
    app.get("/carts/history", auth, App.history);
    app.get("/cart/:cartId", App.findOne);
    app.get("/users/:userId/favorite", auth, App.findFavorite);
    app.get("/bill", App.bill);
    app.get("/bill/user", App.user);
    app.delete("/:cartId", App.removeCart);
   
    // /user/<user_id>/favorite
    // /favorite -> my own all favorites
    // /favorite/<id>
    // /cart/<id>
}