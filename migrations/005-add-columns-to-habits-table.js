const tableName = 'Habits';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(tableName, 'startsAt', {
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
      queryInterface.removeColumn(tableName, 'startsAt'),
      queryInterface.removeColumn(tableName, 'expiresAt'),
      queryInterface.removeColumn(tableName, 'habitActive')
    ]);
  }
};
