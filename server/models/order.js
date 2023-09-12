'use strict';
const orderModel = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        order_date: DataTypes.DATE,
        order_total: DataTypes.NUMERIC,
        num_items: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Order",
            tableName: "orders",
            underscored: true
        }
    )
    return Order;
}

module.exports = {orderModel}