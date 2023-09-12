const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')

const getOrderItems = async (req, res) => { 
    const orderItems = await models.Order_Items.findAll({
        include: [
            {
                model: models.Product,
                attributes: ["product_name", "price"],
                as: "products_in_order",
            },
            {
                model: models.Order,
                attributes: ["order_date", "order_total"],
                as: "order_information"
            }
        ]
    })
    if(orderItems.length !== 0) {
        return res.json(orderItems)
    } else {
        return res.send([]) //send empty response so front-end can check if orderItems.length === 0
    }
}

const saveOrderItemsInfo = async (req, res) => {
    const matchingOrder = await models.Order.findOne({where: {'id': req.body.orderID}, raw: true})
    const productsInOrder = req.body.products;
    productsInOrder.forEach(prod => {
        const newOrderDetails = {
            //id, product_uuid, order_uuid, num_items
            id: uuidv4(),
            product_uuid: prod.id,
            order_uuid: matchingOrder.id,
            num_items: productsInOrder.length,
        }
        return models.Order_Items.create(newOrderDetails);
    })
    res.status(201).send({"message": 'success!'});
}

module.exports = {getOrderItems, saveOrderItemsInfo}