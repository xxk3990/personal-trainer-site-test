const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const userOrders = async (req, res) => {
    const orders = await models.Order.findAll(); //add check for orders based on specific user once users are added
    if (orders.length !== 0) {
        return res.json(orders)
    } else {
        return res.send([]) //send empty response so front-end can check if orders.length === 0
    }
}

const submitOrder = async (req, res) => { //add transactional integrity
    const orderItems = req.body.cart_items;
    const total = req.body.order_total;
    console.log("total:",total)
    if (orderItems.length === 0 || !orderItems) { //if there is an issue with the items in their order
        return res.status(400).send()
    } else {
        const orderDate = new Date(req.body.order_date).toISOString();
        const newOrder = {
            uuid: uuidv4(),
            order_date: orderDate,
            order_total: total,
        }
        try {
            models.sequelize.transaction(async () => {
                orderItems.map(async item => {
                    await models.Order_Item.create({
                        uuid: uuidv4(),
                        order_uuid: newOrder.uuid,
                        product_uuid: item.product_uuid,
                        quantity: item.quantity
                    })
                    await models.Cart_Item.destroy({
                        where: {
                            "product_uuid": item.product_uuid
                        }
                    })
                })
                await models.Order.create(newOrder);
                return res.status(201).send()
            })
        } catch {
            return res.status(400).send();
        }
    }
}

module.exports = {
    userOrders,
    submitOrder
}