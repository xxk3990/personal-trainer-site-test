'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        order_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        order_total: Sequelize.NUMERIC,
        num_items: Sequelize.INTEGER,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};