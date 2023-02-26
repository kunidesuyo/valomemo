const { sequelize, DataTypes } = require('../connect_db');

// 名前変えたい setup_list=>setups
const ImgurApiTokens = sequelize.define('imgur_api_tokens', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  access_token: {
    type: DataTypes.TEXT
  },
  refresh_token: {
    type: DataTypes.TEXT
  },
},
{
  freezeTableName: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

module.exports = ImgurApiTokens;