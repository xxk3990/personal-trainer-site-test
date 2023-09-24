const {
    v4: uuidv4
} = require('uuid')
const models = require('../models')
const utils = require('./controller-utils')

const getProducts = async (req, res) => { 
    const products = await models.Product.findAll();
    if(products.length !== 0) {
        return res.json(products)
    } else {
        return res.send([]) //send empty response so front-end can check if products.length === 0
    }
}

const addProduct = async (req, res) => {
    const priceAsInt = utils.removeDecimalIfNeeded(req.body.price)
    const newProduct = {
        //id, product_name, image_url, price
        uuid: uuidv4(),
        product_name: req.body.product_name,
        image_url: req.body.image_url, //replace with AWS link later on
        price: priceAsInt
    }
    res.status(201).send({"message": 'success!'});
    return models.Product.create(newProduct);
}



module.exports = {getProducts, addProduct}