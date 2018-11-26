const HabitsModel = (sequelize, DataTypes) => {
  const Habits = sequelize.define('Habits', {
    name: {
      type: DataTypes.STRING,
    },
    milestones: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
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
  };

  return Habits;
};

export default HabitsModel;
