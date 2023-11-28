const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getOrderItems = async (req, res) => {
    const orderItems = await models.Order_Item.findAll({
        where: {
            'order_uuid': req.query.orderID
        }
    })
    if (orderItems.length !== 0) {
        const allPrices = orderItems.map(x => x.item_price)
        orderItems.forEach()
        return res.json({
            cart_items: orderItems,
            cart_total: allPrices.reduce((acc, val) => {
                return acc + val
            })
        })
    } else {
        return res.send([])
    }
}

const createOrderItem = async (req, res) => {
    const newOrderItem = {
        //uuid, order_uuid, product_uuid, quantity
        uuid: uuidv4(),
        order_uuid: req.body.order_uuid,
        quantity: req.body.quantity,
        product_uuid: req.body.product_uuid,
    }
    await models.Order_Item.create(newOrderItem)
    return res.status(200).send({
        order_uuid: newOrderItem.order_uuid
    });
}

const updateOrderItem = async (req, res, next) => {
    const item = req.body.item;
    const itemToUpdate = await models.Order_Item.findOne({
        where: {
            "uuid": item.uuid
        }
    })
    if (!itemToUpdate) {
        return res.status(404).send() //send "not found" status code to FE
    } else {
        try {
            models.sequelize.transaction(async () => {
                itemToUpdate.quantity = item.quantity;
                //if the incoming quantity is higher than the current one, increase price
                if(itemToUpdate.quantity < item.quantity) {
                    itemToUpdate.price = itemToUpdate.price + utils.calcUnitPrice(itemToUpdate.price, item.quantity)
                } else { //if not, decrease.
                    itemToUpdate.price = itemToUpdate.price - utils.calcUnitPrice(itemToUpdate.price, item.quantity)
                }
                await itemToUpdate.save();
                return res.status(200).send()
            })
        } catch (error) {
            console.log("PUT error: ", error)
            next(error)
            return res.status(304).send() //send not modified here if it fails
        }
    }


}

const deleteOrderItem = async (req, res) => {
    try {
        models.Order_Item.destroy({
            where: {
                'uuid': req.query.item
            }
        });
        res.status(200).send()
    } catch {
        return res.status(400).send()
    }
}

const buildCartItem = (item, product) => {
    return {

    }
}



module.exports = {
    getOrderItems,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem
}