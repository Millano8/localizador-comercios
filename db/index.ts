const {Sequelize, Model, DataTypes} = require('sequelize')

export const sequelize = new Sequelize('postgres://vcmahfhn:QhonZerhwArS8W2Qw8RlYX9OZnfOH6Zh@babar.db.elephantsql.com/vcmahfhn');



try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }