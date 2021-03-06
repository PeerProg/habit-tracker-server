const MilestoneModel = (sequelize, DataTypes) => {
  const Milestone = sequelize.define('Milestones', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
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
      type: DataTypes.UUID
    }
  });

  return Milestone;
};

export default MilestoneModel;
