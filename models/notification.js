const NotificationModel = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
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
    message: {
      type: DataTypes.STRING(1234),
      allowNull: false
    },
    habitId: {
      type: DataTypes.UUID
    }
  });
  return Notifications;
};

export default NotificationModel;
