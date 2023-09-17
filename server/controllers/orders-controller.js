const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const oi = require("./orderItems-controller");

const userOrders = async (req, res) => { 
    const orders = await models.Order.findAll(); //add check for orders based on specific user once users are added
    if(orders.length !== 0) {
        return res.json(orders)
    } else {
        return res.send([]) //send empty response so front-end can check if orders.length === 0
    }
}

const submitOrder = async (req, res) => {
    const orderDate = new Date(req.body.order_date).toISOString();
    const newOrder = {
        //id, order_date, order_total, number of items
        id: uuidv4(),
        order_date: orderDate,
        order_total: req.body.order_total,
        num_items: req.body.num_items,
    }
    const orderItems = req.body.cart_items
    orderItems.forEach(async ci => {
        await oi.saveOrderItems(newOrder.id, ci.product_name)
    })
    models.Order.create(newOrder);
    res.status(201).send()
      
}

module.exports = {userOrders, submitOrder}