export default (sequelize, DataTypes) => {
  const Habits = sequelize.define('Habits', {
    title: DataTypes.STRING,
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  });
  Habits.associate = (models) => {
    Habits.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Habits;
};
