const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getProducts = async (req, res) => {
    const products = await models.Product.findAll();
    if (products.length !== 0) {
        return res.json(products)
    } else {
        return res.send([]) //send empty response so front-end can check if products.length === 0
    }
}

const addProduct = async (req, res) => {
    const priceAsInt = utils.removeDecimalOrAddZeros(req.body.price) //remove decimal entered on FE
    const newProduct = {
        //id, product_name, image_url, price
        uuid: uuidv4(),
        product_name: req.body.product_name,
        image_url: req.body.image_url, //replace with AWS link later on
        price: priceAsInt,
    }
    res.status(201).send({
        "message": 'success!'
    });
    return models.Product.create(newProduct);
}

const updateProduct = async (req, res) => {
    const prod = req.body.product;
    const prodToUpdate = await models.Product.findOne({
        where: {
            'uuid': prod.uuid
        }
    })
    try {
        models.sequelize.transaction(async () => {
            prodToUpdate.price = utils.removeDecimalOrAddZeros(prod.price);
            prodToUpdate.product_name = prod.product_name;
            prodToUpdate.image_url = prod.image_url;
            await prodToUpdate.save();
            //update all corresponding active cart items if product is updated
            const cartItemsToUpdate = await models.Cart_Item.findAll({
                where: {
                    "product_uuid": prodToUpdate.uuid
                }
            })
            cartItemsToUpdate.map(async ci => {
                ci.price = prodToUpdate.price * ci.quantity;
                ci.prouct_name = prodToUpdate.product_name;
                ci.image_url = prodToUpdate.image_url;
                await ci.save()
            })
            return res.status(200).send()
        })

    } catch {
        return res.status(304).send()
    }
}

const deleteProduct = async (req, res) => {
    try {
        models.sequelize.transaction(async () => {
            models.Product.destroy({
                where: {
                    'uuid': req.query.product
                }
            });
            //if product is deleted, delete all corresponding cart items.
            //Later on notify user of deletion so they are not confused when they see their cart.
            models.Cart_Item.destroy({ 
                where: {
                    'product_uuid': req.query.product
                }
            })
            res.status(200).send()
        })

    } catch {
        return res.status(400).send()
    }

}



module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
}