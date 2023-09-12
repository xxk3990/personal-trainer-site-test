const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')

const getOrders = async (req, res) => { 
    const orders = await models.Order.findAll(); //add check for orders based on specific user once users are added
    if(orders.length !== 0) {
        return res.json(orders)
    } else {
        return res.send([]) //send empty response so front-end can check if products.length === 0
    }
}

const addOrder = async (req, res) => {
    const newOrder = {
        //id, order_date, order_total
        id: uuidv4(),
        order_date: req.body.order_date,
        order_total: req.body.order_total
    }
    const requiredOrderData = {
        order: newOrder,
        orderID: newOrder.id,
    }
    res.status(201).send(requiredOrderData);
    return models.Order.create(newOrder);
}

module.exports = {getOrders, addOrder}