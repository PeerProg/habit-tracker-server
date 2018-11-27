/* eslint-disable no-unused-vars */
const tableName = 'Habits';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise(queryInterface.removeColumn(tableName, 'milestones'));
  },

  down(queryInterface, Sequelize) {
    return Promise(queryInterface.removeColumn(tableName, 'milestones'));
  }
};
