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
  


module.exports = {getOrderItems}