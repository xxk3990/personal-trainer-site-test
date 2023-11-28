'use strict';
const orderItemModel = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('Order_Item', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        order_uuid: DataTypes.UUID,
        product_uuid: DataTypes.UUID,
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_price: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "Order_Item",
        tableName: "order_items",
        underscored: true
    })
    return OrderItem;
}

module.exports = {orderItemModel}