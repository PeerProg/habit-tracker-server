const HabitsModel = (sequelize, DataTypes) => {
  const Habits = sequelize.define('Habits', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    daysBeforeExpiration: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Class methods
  Habits.associate = models => {
    Habits.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Habits.hasMany(models.Milestone, {
      foreignKey: 'habitId',
      onDelete: 'CASCADE'
    });
  };

  return Habits;
};

export default HabitsModel;
