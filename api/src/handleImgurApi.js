const axios = require('axios');
const fs = require('fs');

const generateAccessToken = async (client_id, client_secret) => {
  const [access_token, refresh_token] = getNowTokens();
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
  const [access_token, refresh_token] = getNowTokens();
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

const getNowTokens = () => {
  const access_token = fs.readFileSync("/usr/app/data_backups/Imgur_API_tokens/access_token.txt");
  const refresh_token = fs.readFileSync("/usr/app/data_backups/Imgur_API_tokens/refresh_token.txt");
  return [access_token, refresh_token];
}

const updateTokens = (access_token, refresh_token) => {
  fs.writeFileSync("/usr/app/data_backups/Imgur_API_tokens/access_token.txt", access_token);
  fs.writeFileSync("/usr/app/data_backups/Imgur_API_tokens/refresh_token.txt", refresh_token);
}

const deleteImageForImgur = async (image_url) => {

  console.log("delete start " + image_url);
  const [access_token, refresh_token] = getNowTokens();
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