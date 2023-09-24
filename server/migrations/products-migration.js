'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrementIdentity: true
      },
      product_name: Sequelize.STRING,
      image_url: Sequelize.STRING,
      price: Sequelize.INTEGER,
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
    await queryInterface.dropTable('products');
  }
};