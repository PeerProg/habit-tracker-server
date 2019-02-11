const NotificationModel = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notifications',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(1234),
        allowNull: false
      },
      habitId: {
        type: DataTypes.UUID
      }
    },
    {
      freezeTableName: true
    }
  );
  return Notification;
};

export default NotificationModel;
