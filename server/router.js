const product = require('./controllers/products-controller');
const order = require("./controllers/orders-controller")
const items = require("./controllers/orderItems-controller")

const router = (app) => {
   // app.post('/login', users.login)
 //   app.post('/addUser', users.createAccount)
   // app.get('/verify', mid.verifyRequestAuth, mid.verifySession)
    app.get('/allProducts', product.getProducts)
    app.post('/addProduct', product.addProduct)
    app.get('/orders', order.getOrders)
    app.post('/addOrder', order.addOrder)
    app.get('/orderInfo', items.getOrderItems);
    app.post('/addOrderInfo', items.addItemToOrder)


}

module.exports = router;