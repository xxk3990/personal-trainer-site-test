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
    const priceAsInt = utils.removeDecimalIfNeeded(req.body.price) //remove decimal entered on FE
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

const updateProduct = async (req, res) => {
    const prod = req.body.product;
    const prodToUpdate = await models.Product.findOne({
        where: {
            'uuid': prod.uuid
        }
    })
    try {
        prodToUpdate.price = utils.removeDecimalIfNeeded(prod.price);
        prodToUpdate.product_name = prod.product_name;
        prodToUpdate.image_url = prod.image_url;
        await prodToUpdate.save();
        return res.status(200).send()
    } catch {
        return res.status(304).send()
    }
    

}



module.exports = {getProducts, addProduct, updateProduct}