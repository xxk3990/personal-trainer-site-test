const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const userOrders = async (req, res) => {
    const orders = await models.Order.findAll({
        include: {
            model: models.Order_Item,
            attributes: ['product_uuid', 'quantity'],
            as: "items_in_order",
            //include: []
        }
    }); //add check for orders based on specific user once users are added
    if (orders.length !== 0) {
        return res.json(orders)
    } else {
        return res.send([]) //send empty response so front-end can check if orders.length === 0
    }
}

const createOrder = async (req, res) => {
    const orderDate = new Date(req.body.order_date).toISOString();
    const newOrder = {
        uuid: uuidv4(),
        order_date: orderDate,
        order_total: req.body.order_total,
        completed: false,
    }
    try {
        const item = req.body.item;
        models.sequelize.transaction(async () => {
            await models.Order_Item.create({
                uuid: uuidv4(),
                order_uuid: newOrder.uuid,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                price: item.price,
            })
            await models.Order.create(newOrder);
            return res.status(200).send({
                order_uuid: newOrder.uuid
            })
        })
    } catch {
        return res.status(400).send();
    }
}

const submitOrder = async (req, res) => { //add transactional integrity
    const orderToSubmit = await models.Order.findOne({
        where: {
            'uuid': req.body.orderID
        }
    })
    console.log("total:", total)
    if (orderToSubmit.length === 0 || !orderToSubmit) { //if there is an issue with the items in their order
        return res.status(400).send()
    } else {
        const orderDate = new Date(req.body.order_date).toISOString();
        orderToSubmit.order_date = orderDate;
        orderToSubmit.completed = true;
        await orderToSubmit.save();
        return res.status(200).send();
    }
}

module.exports = {
    userOrders,
    createOrder,
    submitOrder
}