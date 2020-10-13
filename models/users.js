'use strict';
const {
  Model
} = require('sequelize');
const { encryptPwd } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.Review);
      users.hasMany(models.Movie);
      users.hasMany(models.MoviexCategory);
      users.hasMany(models.Category);
    }
  };
  users.init({
    fullname: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: 'Full name must be filled.'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: 'Username must be filled'
        }
      }
    },
    profileimage:{
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
      validate:{
        notEmpty:{
          msg: 'age must be inserted'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: 'choose your gender'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'email must be filled.'
        },
        isEmail:{
          msg:'email address must be email format.'
        }
      }
    },
    password:{
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: 'insert your password.'
        }
      }
    },
    role:{
      type: DataTypes.STRING,
    }
  }, {
    hooks:{
      beforeCreate(users){
        users.role = 'user'
        users.profileimage = 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg'
        users.password = encryptPwd(users.password)
      },
      beforeBulkUpdate(users){
        users.attributes.password = encryptPwd(users.attributes.password)
      }
    },
    sequelize,
    modelName: 'users',
  });
  return users;
};