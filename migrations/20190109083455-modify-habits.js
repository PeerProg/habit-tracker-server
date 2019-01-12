const tableName = 'Habits';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(tableName, 'startAt', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn(tableName, 'expiresAt', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn(tableName, 'habitActive', {
        type: Sequelize.BOOLEAN,
        allowNull: false
      })
    ]);
  },

  /* eslint-disable no-unused-vars */
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(tableName, 'startAt'),
      queryInterface.removeColumn(tableName, 'expiresAt'),
      queryInterface.removeColumn(tableName, 'habitActive')
    ]);
  }
};
