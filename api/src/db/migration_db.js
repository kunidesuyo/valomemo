const Setup = require('./models/Setup');

const migration_db = () => {
  Setup.sync({alter: true})
  .then((result) => {
    console.log("migration success");
    console.log(result);
  })
  .catch((error) => {
    console.log("migration error");
    console.log(error);
  })
}

module.exports = migration_db;
