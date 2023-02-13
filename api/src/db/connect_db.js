const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, 'root', process.env.MYSQL_ROOT_PASSWORD, {
  host: process.env.DB_CONTAINER_NAME,
  dialect: 'mysql',
  // logging: false
});

const sequelize_test = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
sequelize_test();

module.exports = { sequelize, DataTypes };