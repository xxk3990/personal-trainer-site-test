const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getCartItems = async (req, res) => {
    const cartItems = await models.Cart_Item.findAll()
    if (cartItems.length !== 0) {
        const allPrices = cartItems.map(x => x.price)
        const dataForFE = {
            cart_items: cartItems,
            cart_total: allPrices.reduce((acc, val) => {
                return acc + val
            }, 0)
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
        //const priceAsInt = utils.removeDecimalIfNeeded(req.body.price)
        const newCartItem = {
            //uuid, product_name, quantity, product_uuid, price, and image_url
            uuid: uuidv4(),
            product_name: req.body.product_name,
            quantity: req.body.quantity,
            product_uuid: req.body.product_uuid,
            price: req.body.price,
            image_url: req.body.image_url,
        }
        const dataForFE = {
            price: req.body.price,
            quantity: req.body.quantity
        }
        await models.Cart_Item.create(newCartItem)
        return res.status(200).send(dataForFE);
    }
}

const updateCartItem = async (req, res, next) => {
    const itemToUpdate = await models.Cart_Item.findOne({
        where: {
            "uuid": req.body.item.uuid
        }
    })
    if (itemToUpdate.length === 0) {
        return res.status(304).send() //send "Not Modified" status code to FE
    } else {
        try {
            const item = req.body.item;
            itemToUpdate.quantity = item.quantity;
            itemToUpdate.price = item.price;
            await itemToUpdate.save();
            return res.status(200).send()
        } catch (error) {
            console.log("PUT error: ",error)
            next(error)
        }
    }


}

const deleteCartItem = async (req, res) => {
    try {
        models.Cart_Item.destroy({
            where: {
                'uuid': req.query.item
            }
        });
        res.status(200).send()
    } catch {
        return res.status(400).send()
    }
}



module.exports = {
    getCartItems,
    createCartItem,
    updateCartItem,
    deleteCartItem
}