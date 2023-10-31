const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getCartItems = async (req, res) => {
    const cartItems = await models.Cart_Item.findAll() //in future add where user_uuid = req.body.userID
    if (cartItems.length !== 0) {
        cartItems.forEach(ci => {
            if (!utils.integerTest(ci.price)) { //if it fails the integer test
                ci.price = parseFloat(utils.addDecimal(ci.price));
            }
        })
        const allPrices = cartItems.map(x => x.price)
        const cartInts = allPrices.filter(x => utils.integerTest(x));
        const cartDecs = allPrices.filter(x => !utils.integerTest(x));
        console.log("allPrices before reduce:", allPrices)
        const cartIntsTotal = cartInts.reduce((acc, val) => {
            return acc + val
        }, 0)
        const cartDecsTotal = cartDecs.reduce((acc, val) => {
            return acc + val
        }, 0) //calc total cost of 
        const dataForFE = {
            cart_items: cartItems,
            cart_total: cartIntsTotal + cartDecsTotal,
        }
        console.log("cart_total:", dataForFE.cart_total)
        return res.json(dataForFE)
    } else {
        return res.send([])
    }
}

const createCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;
    if (!cartItem) {
        return res.status(400).send()
    } else {
        const priceAsInt = utils.removeDecimalIfNeeded(req.body.price)
        const newCartItem = {
            //uuid, product_name, quantity, product_uuid, price, and image_url
            uuid: uuidv4(),
            product_name: req.body.product_name,
            quantity: req.body.quantity,
            product_uuid: req.body.product_uuid,
            price: priceAsInt,
            image_url: req.body.image_url,
        }
        const dataForFE = {
            price: priceAsInt,
            quantity: req.body.quantity
        }
        await models.Cart_Item.create(newCartItem)
        return res.status(200).send(dataForFE);
    }
}

const updateCartItem = async (req, res, next) => {
    const itemToUpdate = await models.Cart_Item.findOne({
        where: {
            "product_uuid": req.body.item.product_uuid
        }
    })
    if (itemToUpdate.length === 0) {
        return res.status(304).send() //send "Not Modified" status code to FE
    } else {
        try {
            const item = req.body.item;
            const priceAsInt = utils.removeDecimalIfNeeded(req.body.price)
            itemToUpdate.quantity = item.quantity;
            itemToUpdate.price = !utils.integerTest(req.body.price) ? priceAsInt : item.price;
            await itemToUpdate.save();
            return res.status(200).send()
        } catch (error) {
            console.log("PUT error: ",error)
            next(error)
        }
    }


}

const deleteCartItem = async (req, res) => {
    res.status(200).send()
    return models.Cart_Item.destroy({
        where: {
            'product_uuid': req.query.product
        }
    });
}



module.exports = {
    getCartItems,
    createCartItem,
    updateCartItem,
    deleteCartItem
}