import uuid from 'uuid/v4';

const HabitsModel = (sequelize, DataTypes) => {
  const Habits = sequelize.define('Habits', {
    id: {
      type: DataTypes.UUID,
      primarykey: true,
      unique: true,
      allowNull: false,
      defaultValue: uuid(),

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
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
