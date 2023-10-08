const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getCartItems = async(req, res) => {
    const cartItems = await models.Cart_Item.findAll() //in future add where user_uuid = req.body.userID
    if(cartItems.length === 0) {
        return res.send([]);
    } else {
        cartItems.forEach(ci => {
            if(!utils.integerTest(ci.price)) { //if it fails the integer test
                ci.price = Number(utils.addDecimal(ci.price)); //add the decimal point
            }
        })
        const cartPrices = cartItems.map(x => x.price);
        const cartTotal = cartPrices.reduce((acc, val) => {
            return acc + val
        }) //calc total cost of cart
        const formattedTotal = Number(cartTotal).toFixed(2);
        const dataForFE = {
            cartItems: cartItems,
            cart_total: utils.integerTest(cartTotal) ? cartTotal : formattedTotal
        }
        return res.json(dataForFE);
    }
}

const createCartItem = async(req, res) => {
    const cartItem = req.body.cartItem;
    if(!cartItem) {
        return res.status(400).send()
    } else {
        const formattedPrice = utils.removeDecimalIfNeeded(req.body.price)
        const newCartItem = {
            //uuid, product_name, quantity, product_uuid, price, and image_url
            uuid: uuidv4(),
            product_name: req.body.product_name,
            quantity: req.body.quantity,
            product_uuid: req.body.product_uuid,
            price: formattedPrice,
            image_url: req.body.image_url,
            
        }
        await models.Cart_Item.create(newCartItem)
        return res.status(200).send();
    }
}

const updateCartItem = async(req, res) => {
    const itemToUpdate = await models.Cart_Item.findOne({where: {"product_uuid" : req.body.product_uuid}})
    if(itemToUpdate.length === 0) {
        return res.status(400).send()
    } else {
        itemToUpdate.quantity = req.body.quantity;
        itemToUpdate.price = utils.removeDecimalIfNeeded(req.body.price)
        await itemToUpdate.save();
        return res.status(200).send()
    }
    
}

const deleteCartItem = async (req, res) => {
    res.status(200).send()
    return models.Cart_Item.destroy({where: {'product_uuid':req.query.product}});
}



module.exports = {getCartItems, createCartItem, updateCartItem, deleteCartItem}