const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')

const userOrders = async (req, res) => { 
    const orders = await models.Order.findAll(); //add check for orders based on specific user once users are added
    if(orders.length !== 0) {
        return res.json(orders)
    } else {
        return res.send([]) //send empty response so front-end can check if products.length === 0
    }
}

const submitOrder = async (req, res) => {
    const newOrder = {
        //id, order_date, order_total, number of items
        id: uuidv4(),
        order_date: req.body.order_date,
        order_total: req.body.order_total,
        num_items: req.body.num_items,
    }
    const requiredOrderData = {
        order: newOrder,
        orderID: newOrder.id,
    }
    res.status(201).send(requiredOrderData);
    return models.Order.create(newOrder);
}

module.exports = {userOrders, submitOrder}