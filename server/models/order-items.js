'use strict';
const orderItemsModel = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('Order_Items', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        order_uuid: DataTypes.UUID,
        product_uuid: DataTypes.UUID,
        num_items: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: "Order_Items",
            tableName: "order_items",
            underscored: true
        }
    )
    return OrderItem;
}

module.exports = {orderItemsModel}