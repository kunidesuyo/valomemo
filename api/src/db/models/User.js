const { sequelize, DataTypes } = require('../connect_db');

// 名前変えたい setup_list=>setups
const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.TEXT
  },
  password: {
    type: DataTypes.TEXT
  },
},
{
  freezeTableName: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

module.exports = User;