const tableName = 'Habits';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(tableName, 'expiresAt', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn(tableName, 'daysBeforeExpiration', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  /* eslint-disable no-unused-vars */
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(tableName, 'expiresAt'),
      queryInterface.removeColumn(tableName, 'daysBeforeExpiration')
    ]);
  }
};
