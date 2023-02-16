const axios = require('axios');
const fs = require('fs');
const ImgurApiTokens = require('./db/models/ImgurApiTokens');

const generateAccessToken = async () => {
  let client_id;
  let client_secret;
  if(process.env.DEV_OR_PRO === "DEV") {
    client_id = process.env.DEV_IMGUR_API_CLIENT_ID;
    client_secret = process.env.DEV_IMGUR_API_CLIENT_SECRET;
  } else if(process.env.DEV_OR_PRO === "PRO") {
    client_id = process.env.PRO_IMGUR_API_CLIENT_ID;
    client_secret = process.env.PRO_IMGUR_API_CLIENT_SECRET;
  }
  const [access_token, refresh_token] = await getNowTokens();
  var params = new URLSearchParams();
  params.append("refresh_token", refresh_token);
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("grant_type", "refresh_token");
  await axios.post("https://api.imgur.com/oauth2/token", params)
  .then((res) => {
    console.log("get token success");
    console.log("access_token: " + res.data.access_token);
    console.log("refresh_token: " + res.data.refresh_token);
    const new_access_token = res.data.access_token;
    const new_refresh_token = res.data.refresh_token;
    updateTokens(new_access_token, new_refresh_token);
    //return [res.data.access_token, res.data.refresh_token];
  })
  .catch((error) => {
    console.log("get token error");
    console.log(error);
  })
}

const uploadImageForImgur = async (base64_image) => {
  const [access_token, refresh_token] = await getNowTokens();
  const upload_url = "https://api.imgur.com/3/upload";
  const headers = {"Authorization": "Bearer " + access_token};
  var upload_params = new URLSearchParams();
  upload_params.append("image", base64_image);
  upload_params.append("type", "base64");
  //upload_params.append("name", test.png);
  await axios.post(upload_url, upload_params, {headers: headers})
  .then((res) => {
    console.log("upload success");
    //console.log(res.data);
    //console.log(res.data.data);
    console.log(res.data.data.link);
    return res.data.data.link;
  })
  .catch((error) => {
    console.log("upload error");
    console.log(error);
  })
}

const getNowTokens = async () => {
  let access_token;
  let refresh_token;
  if(process.env.DEV_OR_PRO === "DEV") {
    console.log("dev get now tokens")
    access_token = fs.readFileSync("/usr/api/data_backups/Imgur_API_tokens/access_token.txt");
    refresh_token = fs.readFileSync("/usr/api/data_backups/Imgur_API_tokens/refresh_token.txt");
  } else if (process.env.DEV_OR_PRO === "PRO") {
    console.log("production")
    await ImgurApiTokens.findOne({where: {id: 1}})
    .then((result) => {
      access_token = result.access_token;
      refresh_token = result.refresh_token;
    })
    .catch((error) => {
      console.log("db error(imgur api tokens)")
      console.log(error);
    })
  }
  
  return [access_token, refresh_token];
}

const updateTokens = async (access_token, refresh_token) => {
  if(process.env.DEV_OR_PRO === "DEV") {
    console.log("dev update tokens")
    fs.writeFileSync("/usr/api/data_backups/Imgur_API_tokens/access_token.txt", access_token);
    fs.writeFileSync("/usr/api/data_backups/Imgur_API_tokens/refresh_token.txt", refresh_token);
  } else if(process.env.DEV_OR_PRO === "PRO") {
    console.log("production")
    const newTokens = {access_token: access_token, refresh_token: refresh_token};
    await ImgurApiTokens.update(newTokens, {where: {id: 1}})
    .then((result) => {
      console.log("imgur api token update success");
      console.log(result);
    })
    .catch((error) => {
      console.log("imgur api token update error");
      console.log(error);
    })
  }
  
}

const deleteImageForImgur = async (image_url) => {

  console.log("delete start " + image_url);
  const [access_token, refresh_token] = await getNowTokens();
  //urlを画像ハッシュにする
  let imageHash = image_url.replace('https://i.imgur.com/', '');
  //console.log(imageHash);
  //拡張子を取り除く
  imageHash = imageHash.replace(/\..+$/, '');
  //console.log(imageHash);
  const headers = {"Authorization": "Bearer " + access_token};
  await axios.delete(`https://api.imgur.com/3/image/${imageHash}`, {headers: headers})
  .then((res) => {
    console.log("delete success");
    //console.log(res);
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  })

}

module.exports.generateAccessToken = generateAccessToken;
module.exports.uploadImageForImgur = uploadImageForImgur;
module.exports.getNowTokens = getNowTokens;
module.exports.updateTokens = updateTokens;
module.exports.deleteImageForImgur = deleteImageForImgur;