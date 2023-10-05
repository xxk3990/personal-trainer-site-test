'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cart_items', {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrementIdentity: true
      },
      product_name: Sequelize.STRING,
      quantity: Sequelize.INTEGER,
      product_uuid: Sequelize.UUID,
      price: Sequelize.INTEGER,
      image_url: Sequelize.STRING,
      //eventually user uuid will be added which will be a foreign key to the Users table!
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cart_items');
  }
};