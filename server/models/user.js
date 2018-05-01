import bcrypt from 'bcrypt';

const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
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
  }, {
    hooks: {
      beforeCreate(user) {
        user.hashPassword();
      },
    },
  });

  // Class methods
  User.associate = (models) => {
    User.hasMany(models.Habits, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
    });
  };

  // Instance methods
  User.prototype.hashPassword = function hashPassword() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(9));
    return this.password;
  };

  User.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};

export default UserModel;
