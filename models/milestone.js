const MilestoneModel = (sequelize, DataTypes) => {
  const Milestone = sequelize.define('Milestone', {
    title: {
      type: DataTypes.STRING(1234),
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    habitId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  });

  // Class methods
  Milestone.associate = (models) => {
    Milestone.belongsTo(models.Habits, {
      foreignKey: 'habitId',
      onDelete: 'CASCADE',
    });
  };

  return Milestone;
};

export default MilestoneModel;
