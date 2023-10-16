'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const environment = 'production';
//const process = require("process")
const env = require("../.env")
const config = require(`${__dirname}/../config/config.js`)[environment];
const db = {};
const bcrypt = require("bcrypt");
const { productModel } = require('./product');
const { orderModel } = require("./order")
const { orderItemModel } = require("./order-item");
const { cartItemModel } = require("./cart-item")
const rdsCa = fs.readFileSync('../server/us-east-2-bundle.pem');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: environment === 'production' ? process.env.AWS_HOST : 'localhost',
  port: 5432,
  logging: console.log,
  dialect: 'postgres',
  pool: { maxConnections: 5, maxIdleTime: 30},
  language: 'en',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
      ca: [rdsCa]
    }
  }
})

const models = {
  Product: productModel(sequelize, Sequelize.DataTypes),
  Order: orderModel(sequelize, Sequelize.DataTypes),
  Order_Item: orderItemModel(sequelize, Sequelize.DataTypes),
  Cart_Item: cartItemModel(sequelize, Sequelize.DataTypes)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(() => {
    for(const m of Object.values(models)) {
      db[m.name] = m;
    }
    
  });
  models.Order.hasMany(models.Order_Item, {
    as: "items_in_order",
    foreignKey: "order_uuid"
  })



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;