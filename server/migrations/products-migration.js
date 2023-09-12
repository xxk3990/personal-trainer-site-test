'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        product_name: Sequelize.STRING,
        image_url: Sequelize.STRING,
        price: Sequelize.NUMERIC,
        
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};