'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};
const bcrypt = require("bcrypt");
const { productModel } = require('./product');
const { orderModel } = require("./order")
const { orderItemModel } = require("./order-item");

const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: 'postgres',
  host: 'localhost',
})

const models = {
    Product: productModel(sequelize, Sequelize.DataTypes),
    Order: orderModel(sequelize, Sequelize.DataTypes),
    Order_Item: orderItemModel(sequelize, Sequelize.DataTypes)
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