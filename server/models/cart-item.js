'use strict';
const cartItemModel = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('Cart_Item', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        product_name: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        product_uuid: DataTypes.UUID,
        price: DataTypes.INTEGER,
        image_url: DataTypes.STRING,
        //eventually user uuid will be added which will be a foreign key to the Users table!
        place_in_cart: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Cart_Item",
            tableName: "cart_items",
            underscored: true
        }
    )
    return CartItem;
}

module.exports = {cartItemModel}