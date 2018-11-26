const HabitsModel = (sequelize, DataTypes) => {
  const Habits = sequelize.define('Habits', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    milestones: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      get() {
        return this.getDataValue('milestones');
      },
      set(val) {
        const existingMilestones = this.getDataValue('milestones');
        const newMilestones = existingMilestones.concat([val]);
        this.setDataValue('milestones', newMilestones);
      }
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
