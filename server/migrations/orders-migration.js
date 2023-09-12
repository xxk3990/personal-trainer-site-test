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
        
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};