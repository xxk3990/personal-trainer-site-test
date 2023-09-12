'use strict';
const orderModel = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        order_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        order_total: DataTypes.NUMERIC,
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