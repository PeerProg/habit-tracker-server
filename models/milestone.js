import uuid from 'uuid/v4';

const MilestoneModel = (sequelize, DataTypes) => {
  const Milestone = sequelize.define('Milestone', {
    id: {
      type: DataTypes.UUID,
      primarykey: true,
      unique: true,
      allowNull: false,
      defaultValue: uuid(),

    },
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
      type: DataTypes.UUID,
    },
  }, {
    freezeTableName: true
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
