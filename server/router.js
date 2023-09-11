

const router = (app) => {
   // app.post('/login', users.login)
 //   app.post('/addUser', users.createAccount)
   // app.get('/verify', mid.verifyRequestAuth, mid.verifySession)
    app.get('/allProducts', product.getAllProducts)
    app.post('/addProduct', product.addProduct)
    app.get("/allOrders", order.getAllOrders)
}

module.exports = router;