const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')

const getOrderItems = async (req, res) => { 
    const orderItems = await models.Order_Item.findAll({where: {'order_uuid': req.body.orderID}})
    if(orderItems.length !== 0) {
        return res.json(orderItems)
    } else {
        return res.send([]) //send empty response so front-end can check if orderItems.length === 0
    }
}

const saveOrderItems = async (orderUUID, productUUID, quantity) => {
    const matchingProduct = await models.Product.findOne({where: {'uuid': productUUID}})
    if(matchingProduct.length === 0 || orderUUID === undefined) {
        return;
    } else {
        const newOrderItem = {
            //id, product_uuid, order_uuid
            uuid: uuidv4(),
            order_uuid: orderUUID,
            product_uuid: matchingProduct.uuid,
            quantity: quantity,
        }
        return models.Order_Item.create(newOrderItem);
    }
}

module.exports = {getOrderItems, saveOrderItems}