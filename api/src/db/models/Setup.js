const { sequelize, DataTypes } = require('../connect_db');

// 名前変えたい setup_list=>setups
const Setup = sequelize.define('setup_list', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT
  },
  map: {
    type: DataTypes.TEXT
  },
  agent: {
    type: DataTypes.TEXT
  },
  ability: {
    type: DataTypes.TEXT
  },
  position_image: {
    type: DataTypes.TEXT
  },
  aim_image: {
    type: DataTypes.TEXT
  },
  landing_image: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  },
  created_by: {
    type: DataTypes.TEXT
  },
},
{
  freezeTableName: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

module.exports = Setup;