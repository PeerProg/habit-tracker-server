const tableName = 'Habits';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(tableName, 'content'),
      queryInterface.addColumn(tableName, 'name', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn(tableName, 'milestones', {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false,
      })
    ]);
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(tableName, 'name'),
      queryInterface.removeColumn(tableName, 'milestones')
    ]);
  }
};
