const {Model, DataTypes} = require('sequelize')
import { sequelize } from "./index";

export class User extends Model{}
      User.init({
        email: DataTypes.STRING,
        name: DataTypes.STRING,
        birthdate: DataTypes.DATE
      },{
        sequelize, 
        modelname: "User"
      }
);
