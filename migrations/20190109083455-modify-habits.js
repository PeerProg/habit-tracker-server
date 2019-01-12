const tableName = 'Habits';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(tableName, 'startDate', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn(tableName, 'expiresAt', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn(tableName, 'daysBeforeExpiration', {
        type: Sequelize.STRING,
        allowNull: false
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
