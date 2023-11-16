const product = require('./controllers/products-controller');
const order = require("./controllers/orders-controller")
const items = require("./controllers/orderItems-controller")
const cart = require("./controllers/cartItems-controller")

const router = (app) => {
   // app.post('/login', users.login)
 //   app.post('/addUser', users.createAccount)
   // app.get('/verify', mid.verifyRequestAuth, mid.verifySession)
    app.get('/products', product.getProducts)
    app.post('/products', product.addProduct) //admin only
    app.put('/products', product.updateProduct)
    app.delete('/products', product.deleteProduct)
    app.get('/orders', order.userOrders) //this one is for specific users, need another for admin purposes
    //app.get('/allOrders', admin.getAllOrders) not created yet
    app.post('/orders', order.submitOrder)
    app.get('/orderItems', items.getOrderItems);
    app.get('/cart-items', cart.getCartItems)
    app.post("/cart-items", cart.createCartItem);
    app.put('/cart-items', cart.updateCartItem);
    app.delete("/cart-items", cart.deleteCartItem)


}

module.exports = router;