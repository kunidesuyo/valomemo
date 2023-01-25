const axios = require('axios');
const fs = require('fs');

const generateAccessToken = async (refresh_token, client_id, client_secret) => {
  var params = new URLSearchParams();
  params.append("refresh_token", refresh_token);
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("grant_type", "refresh_token");
  await axios.post("https://api.imgur.com/oauth2/token", params)
  .then((res) => {
    console.log("get token success");
    //console.log(res.data);
    return res.data.access_token;
  })
  .catch((error) => {
    console.log("get token error");
    console.log(error);
  })
}

const uploadImageForImgur = async (base64_image, access_token) => {
  const upload_url = "https://api.imgur.com/3/upload";
  const headers = {"Authorization": "Bearer " + access_token};
  var upload_params = new URLSearchParams();
  upload_params.append("image", base64_image);
  upload_params.append("type", "base64");
  //upload_params.append("name", test.png);
  await axios.post(upload_url, upload_params, {headers: headers})
  .then((res) => {
    console.log("upload success");
    console.log(res.data);
  })
  .catch((error) => {
    console.log("upload error");
    console.log(error);
  })
}

module.exports.generateAccessToken = generateAccessToken;
module.exports.uploadImageForImgur = uploadImageForImgur;