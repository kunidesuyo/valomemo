const { Sequelize, DataTypes } = require('sequelize');

let db_name, db_username, db_host, db_dialect, db_port;


//console.log(process.env.DB_PORT);
if(process.env.DEV_OR_PRO === "DEV") {
  db_name = process.env.MYSQL_DATABASE;
  db_username = process.env.DB_USERNAME;
  db_password = process.env.DB_PASSWORD;
  db_host = process.env.DB_HOST_NAME;
  db_dialect = process.env.DB_DIALECT;
  db_port = process.env.DB_PORT;
} else if (process.env.DEV_OR_PRO === "PRO"){
  db_name = process.env.MYSQL_DATABASE;
  db_username = process.env.DB_USERNAME;
  db_password = process.env.DB_PASSWORD;
  db_host = process.env.DB_HOST_NAME;
  db_dialect = process.env.DB_DIALECT;
  db_port = process.env.DB_PORT;
}

const sequelize = new Sequelize(
  db_name, 
  db_username, 
  db_password, 
  {
    host: db_host,
    dialect: db_dialect,
    port: db_port,
  }
);

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