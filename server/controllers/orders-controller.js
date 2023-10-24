const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const userOrders = async (req, res) => {
    const orders = await models.Order.findAll(); //add check for orders based on specific user once users are added
    if (orders.length !== 0) {
        orders.forEach(odr => {
            if (!utils.integerTest(odr.order_total)) {
                const decimalTotal = Number(odr.order_total).toFixed(2);
                console.log(decimalTotal);
                const totalSplit = decimalTotal.split(".")
                if (decimalTotal[decimalTotal.length - 2] === ".") {
                    const zero = 0;
                    totalSplit[1] = `${totalSplit[1]}${zero}`
                    odr.order_total = parseFloat(Number(`${totalSplit[0]}.${totalSplit[1]}`).toFixed(2))
                } else {
                    odr.order_total = utils.addDecimal(odr.order_total)
                }
            }
        })
        return res.json(orders)
    } else {
        return res.send([]) //send empty response so front-end can check if orders.length === 0
    }
}

const submitOrder = async (req, res) => { //add transactional integrity
    const orderItems = req.body.cart_items;
    if (orderItems.length === 0 || !orderItems) { //if there is an issue with the items in their order
        return res.status(400).send()
    } else {
        const orderDate = new Date(req.body.order_date).toISOString();
        const newOrder = {
            //id, order_date, order_total
            uuid: uuidv4(),
            order_date: orderDate,
            order_total: ""
        }
        const totalString = req.body.order_total.toString();
        if (totalString[totalString - 2] === ".") {
            const totalSplit = totalString.split(".")
            totalSplit[1] = `${totalSplit[1]}0`
            newOrder.order_total = utils.removeDecimalIfNeeded(parseFloat(`${totalSplit[0]}.${totalSplit[1]}`).toFixed(2))
        } else {
            newOrder.order_total = utils.removeDecimalIfNeeded(req.body.order_total)
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