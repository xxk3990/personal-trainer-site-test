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

const submitOrder = async (req, res) => { //add transactional integrity
    const orderItems = req.body.cart_items;
    if(orderItems.length === 0 || !orderItems) { //if there is an issue with the items in their order
        return res.status(400).send()
    } else {
        const orderDate = new Date(req.body.order_date).toISOString();
        const newOrder = {
            //id, order_date, order_total, number of items
            uuid: uuidv4(),
            order_date: orderDate,
            order_total: req.body.order_total,
            num_items: req.body.num_items,
        }
        orderItems.forEach(async ci => {
            await oi.saveOrderItems(newOrder.uuid, ci.product_uuid, ci.quantity);
        })
        models.Order.create(newOrder);
        return res.status(201).send()
    }
}

module.exports = {userOrders, submitOrder}