const Setup = require('./models/Setup');
const User = require('./models/User');
const ImgurApiTokens = require('./models/ImgurApiTokens')

const migration_db = async () => {
  await Setup.sync({alter: true})
  .then((result) => {
    console.log("Setup migration success");
    //console.log(result);
  })
  .catch((error) => {
    console.log("Setup migration error");
    console.log(error);
  })

  await User.sync({alter: true})
  .then((result) => {
    console.log("User migration success");
    //console.log(result);
  })
  .catch((error) => {
    console.log("User migration error");
    console.log(error);
  })

  await ImgurApiTokens.sync({alter: true})
  .then((result) => {
    console.log("ImgurApiTokens migration success");
    //console.log(result);
  })
  .catch((error) => {
    console.log("ImgurApiTokens migration error");
    console.log(error);
  })

  // imgur api tokenを挿入。環境変数を参照するようにする。
  /*const imgur_access_token = process.env.IMGUR_ACCESS_TOKEN;
  const imgur_refresh_token = process.env.IMGUR_REFRESH_TOKEN;
  const tokens = {
    access_token: imgur_access_token,
    refresh_token: imgur_refresh_token,
  }
  await ImgurApiTokens.create(tokens)
  .then((result) => {
    console.log("imgur api tokens inserted success");
  })
  .catch((error) => {
    console.log("imgur api tokens inserted error");
    console.log(error);
  })*/
  //
}

module.exports = migration_db;
