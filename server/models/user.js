export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Class methods
  User.associate = (models) => {
    User.hasMany(models.Habits, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
    });
  };

  return User;
};
