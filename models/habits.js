const HabitsModel = (sequelize, DataTypes) => {
  const Habits = sequelize.define('Habits', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  });

  // Class methods
  Habits.associate = (models) => {
    Habits.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    Habits.hasMany(models.Milestone, {
      foreignKey: 'habitId',
      onDelete: 'CASCADE',
    });
  };

  return Habits;
};

export default HabitsModel;
