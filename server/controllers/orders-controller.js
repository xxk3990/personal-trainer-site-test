const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')


//The submit order method has been moved to the stripe-controller and occurs on payment success.


const userOrders = async (req, res) => {
    const orders = await models.Order.findAll({
        where: {
            'completed': true,
            'user_uuid': req.query.userID
        },
        include: {
            model: models.Order_Item,
            attributes: ['product_uuid', 'quantity'],
            as: "items_in_order",
        }
    });
    if (orders.length !== 0) {
        return res.json(orders)
    } else {
        return res.send([]) //send empty response so front-end can check if orders.length === 0
    }
}

const getOrderedProducts = async(req, res) => {
    const order = req.query.orderID;
    const itemsOrdered = await models.Order_Item.findAll({where: {"order_uuid": order}})
    const items = [...itemsOrdered];
    for(let i = 0; i < items.length; i++) {
        const prod = await models.Product.findOne({ where: {"uuid" : items[i].product_uuid}, raw: true})
        items[i] = {
            ...prod,
            quantity: items[i].quantity
        }
    }
    return res.status(200).json(items);
}

const createOrder = async (req, res) => {
    const orderDate = new Date(req.body.order_date).toISOString();
    const newOrder = {
        uuid: uuidv4(),
        user_uuid: req.body.user_uuid,
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
            })
            await models.Order.create(newOrder);
            return res.status(200).json({
                order_uuid: newOrder.uuid
            })
        })
    } catch {
        return res.status(400).send();
    }
}

module.exports = {
    userOrders,
    createOrder,
    getOrderedProducts
}