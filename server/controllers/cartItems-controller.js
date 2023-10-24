const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getCartItems = async (req, res) => {
    const cartItems = await models.Cart_Item.findAll() //in future add where user_uuid = req.body.userID
    if (cartItems.length === 0) {
        return res.send([]);
    } else {
        cartItems.forEach(ci => {
            if (!utils.integerTest(ci.price)) { //if it fails the integer test
                ci.price = utils.addDecimal(ci.price); //add the decimal
            }
        })
        const cartInts = cartItems.map(x => x.price).filter(x => utils.integerTest(x)); //get all ints
        const cartDecs = cartItems.map(x => x.price).filter(x => !utils.integerTest(x)); //get all decimals
   
        if (cartInts.length !== 0) {
            const cartIntsTotal = cartInts.reduce((acc, val) => {
                return acc + val
            }, 0) //calc total cost of cart
            if (cartDecs.length !== 0) {
                const cartDecsTotal = cartDecs.reduce((acc, val) => {
                    return Number(acc) + Number(val)
                }, 0)
                console.log("ints:", cartInts);
                console.log("decs:", cartDecs)
                if (!utils.integerTest(cartDecsTotal)) {
                    const checkDecs = Number(cartDecsTotal).toFixed(2)
                    if (checkDecs[checkDecs.length - 2] === '.') {
                        console.log("zero check reached")
                        const split = checkDecs.split(".")
                        const zero = 0;
                        const decimalSide = `${split[1]}${zero}`
                        const parsedTotal = parseFloat(`${split[0]}.${decimalSide}`).toFixed(2);
                        console.log(parsedTotal)
                        const dataForFE = {
                            cart_items: cartItems,
                            cart_totals: {
                                ints: cartIntsTotal,
                                decs: Number(parsedTotal)
                            }
                        }
                        console.log("cartTotals: ", dataForFE.cart_totals)
                        return res.json(dataForFE);
                    } else {
                        console.log("total of decimals when ints !== 0:", cartDecsTotal)
                        const dataForFE = {
                            cart_items: cartItems,
                            cart_totals: {
                                ints: cartIntsTotal,
                                decs: Number(Number(cartDecsTotal).toFixed(2))
                            }
                        }
                        console.log("cartTotals: ",dataForFE.cart_totals)
                        return res.json(dataForFE);
                    }
                }
            } else {
                const dataForFE = {
                    cart_items: cartItems,
                    cart_totals: {
                        ints: cartIntsTotal,
                        decs: 0
                    }
                }
                console.log(dataForFE.cart_totals)
                return res.json(dataForFE);
            }
        } else {
            if (cartDecs.length !== 0) {
                const cartDecsTotal = cartDecs.reduce((acc, val) => {
                    return Number(acc) + Number(val)
                }, 0)
                //TODO: FIGURE OUT HOW TO HAVE TOTAL DISPLAY WITH ZERO IF CENTS < 10
                //TODO: FIGURE OUT WHY ONLY THE FIRST RESULT WITH A DECIMAL IS BEING ADDED.
                if (!utils.integerTest(cartDecsTotal)) {
                    const checkDecs = Number(cartDecsTotal).toFixed(2)
                    if (checkDecs[checkDecs.length - 2] === '.') {
                        console.log("zero check reached")
                        const split = checkDecs.split(".")
                        const zero = 0;
                        const decimalSide = `${split[1]}${zero}`
                        const parsedTotal = parseFloat(`${split[0]}.${decimalSide}`).toFixed(2);
                        console.log(parsedTotal)
                        const dataForFE = {
                            cart_items: cartItems,
                            cart_totals: {
                                ints: 0,
                                decs: Number(parsedTotal)
                            }
                        }
                        console.log(dataForFE.cart_totals)
                        return res.json(dataForFE);
                    } else {
                        console.log("dec total with no int: ", cartDecsTotal)
                        const dataForFE = {
                            cart_items: cartItems,
                            cart_totals: {
                                ints: 0,
                                decs: Number(cartDecsTotal)
                            }
                        }
                        
                        return res.json(dataForFE);
                    }
                }
            }
        }


    }
}

const createCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;
    if (!cartItem) {
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
            itemToUpdate.quantity = item.quantity;
            const priceString = item.price.toString();
            if (priceString[priceString.length - 2] === ".") { //if it needs to have a zero
                const priceSplit = priceString.split(".");
                const zero = 0;
                const decimalSide = `${priceSplit[1]}${zero}`
                const parseWithZero = parseFloat(`${priceSplit[0]}.${decimalSide}`).toFixed(2);
                // console.log("with zero:",parseWithZero)
                //save it with the zero so the decimal location is accurate (ex: 199.90 would be 19.99 without it)
                itemToUpdate.price = utils.removeDecimalIfNeeded(parseWithZero);
            } else {
                itemToUpdate.price = utils.removeDecimalIfNeeded(item.price)
            }
            await itemToUpdate.save();
            return res.status(200).send()
        } catch (error) {
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