const product = require('./controllers/products-controller');
const order = require("./controllers/orders-controller")
const items = require("./controllers/orderItems-controller")

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
    app.post('/orders', order.createOrder)
    app.put('/orders', order.submitOrder)
    app.get('/order-items', items.getOrderItems)
    app.post("/order-items", items.createOrderItem);
    app.put('/order-items', items.updateOrderItem);
    app.delete("/order-items", items.deleteOrderItem)


}

module.exports = router;