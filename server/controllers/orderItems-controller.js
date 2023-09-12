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

const addItemToOrder = async (req, res) => {
    const matchingOrder = await models.Order.findOne({where: {'id': req.body.orderID}, raw: true})
    const matchingProduct = await models.Product.findOne({where: {'product_name': req.body.product_name}})
    const newOrderItem = {
        //id, product_uuid, order_uuid
        id: uuidv4(),
        order_uuid: matchingOrder.id,
        product_uuid: matchingProduct.id
    }
    res.status(201).send({"message": 'success!'});
    return models.Order_Item.create(newOrderItem);
}

module.exports = {getOrderItems, addItemToOrder}