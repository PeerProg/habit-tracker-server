const tableName = 'Users';

module.exports = {
  up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(tableName, 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      }),

      queryInterface.addColumn(tableName, 'isAdmin', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }),

      queryInterface.addColumn(tableName, 'isSuperAdmin', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      })
    ];
  },

  down(queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn(tableName, 'isActive'),
      queryInterface.removeColumn(tableName, 'isAdmin'),
      queryInterface.removeColumn(tableName, 'isSuperAdmin')
    ];
  }
};
