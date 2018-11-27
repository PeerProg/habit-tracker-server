/* eslint-disable no-unused-vars */
const tableName = 'Habits';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.removeColumn(tableName, 'milestones');
  },

  down(queryInterface, Sequelize) {
    queryInterface.addColumn(tableName, 'milestones', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false,
    });
  }
};
