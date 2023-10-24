const product = require('./controllers/products-controller');
const order = require("./controllers/orders-controller")
const items = require("./controllers/orderItems-controller")
const cart = require("./controllers/cartItems-controller")

const router = (app) => {
   // app.post('/login', users.login)
 //   app.post('/addUser', users.createAccount)
   // app.get('/verify', mid.verifyRequestAuth, mid.verifySession)
    app.get('/allProducts', product.getProducts)
    app.post('/addProduct', product.addProduct) //admin only
    app.get('/userOrders', order.userOrders) //this one is for specific users, need another for admin purposes
    //app.get('/allOrders', admin.getAllOrders) not created yet
    app.post('/submitOrder', order.submitOrder)
    app.get('/orderItems', items.getOrderItems);
    app.get('/cartItems', cart.getCartItems)
    app.post("/addToCart", cart.createCartItem);
    app.put('/updateCartItem', cart.updateCartItem);
    app.delete("/deleteCartItem", cart.deleteCartItem)


}

module.exports = router;