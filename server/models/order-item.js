'use strict';
const orderItemModel = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('Order_Item', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        order_uuid: DataTypes.UUID,
        product_uuid: DataTypes.UUID,
        },
        {
            sequelize,
            modelName: "Order_Item",
            tableName: "order_items",
            underscored: true
        }
    )
    return OrderItem;
}

module.exports = {orderItemModel}