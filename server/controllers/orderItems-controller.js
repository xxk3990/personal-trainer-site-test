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

const saveOrderItems = async (orderID, productName) => {
    const matchingProduct = await models.Product.findOne({where: {'product_name': productName}})
    if(!matchingProduct) {
        return; //bail out and fail
    } else {
        const newOrderItem = {
            //id, product_uuid, order_uuid
            id: uuidv4(),
            order_uuid: orderID,
            product_uuid: matchingProduct.id
        }
        return models.Order_Item.create(newOrderItem);
    }
   
}

module.exports = {getOrderItems, saveOrderItems}