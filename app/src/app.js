const express = require('express');
const app = express();
const port = 8080;

const mysql = require('mysql');

const table_name = process.env.TABLE_NAME;

const connection = mysql.createConnection({
  host: process.env.DB_CONTAINER_NAME, 
  //コンテナ名を指定(同ネットワーク内なので名前解決できる？)
  user: 'root',
  //password: 'password',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});


connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('db connected');
  }
});


// なくても動くけど一応
app.set('view engine', 'ejs');

// viewsの参照先を変更
app.set('views', '/usr/app/src/views');

//cssとimageを使用可能にする
app.use(express.static('/usr/app/src/public'));

//フォームの値を受け取るための文
app.use(express.urlencoded({extended: false, limit: '20mb'}));

app.get('/', (req, res) => {
  //res.send('test complete')
  res.render('hello.ejs');
});


// imgur api
const client_id = process.env.IMGUR_API_CLIENT_ID;
const client_secret = process.env.IMGUR_API_CLIENT_SECRET;

const axios = require('axios');
const fs = require('fs');
const handleImgurApi = require('./handleImgurApi.js');
const generateAccessToken = handleImgurApi.generateAccessToken;
const uploadImageForImgur = handleImgurApi.uploadImageForImgur;
const getNowTokens = handleImgurApi.getNowTokens;

let access_token;
let refresh_token;

//let access_token = "";

app.get('/json-test', () => {
  const data = JSON.parse(fs.readFileSync("/usr/app/common_info/common_info.json"));
  //console.log(data);
  const setup_list_column_name = data.setup_list_column_name;
  console.log(setup_list_column_name);
});

app.get('/imgur-test', async (req, res) => {

  //fs.writeFileSync("./src/test.txt", "bbb");

  //[access_token, refresh_token] = getNowTokens();
  //let tokens = getNowTokens();
  //console.log(tokens);
  //console.log("access_token: " + access_token);
  //console.log("refresh_token: " + refresh_token);
  generateAccessToken(client_id, client_secret);

  const image = fs.readFileSync('/usr/app/src/testdata/test1-3.png', 'base64');
  

  uploadImageForImgur(image);

});


//api
app.get('/api/read', (req, res) => {
  connection.query(
    'SELECT * FROM ' + table_name,
    (error, results) => {
      console.log(results);
      res.send(results);
    }
  )
});

app.post('/api/create', async (req, res) => {
  console.log('create connect------------');
  //console.log(req.body.position_image);
  //バリデーションチェック追加予定
  //console.log(req.body.content);

  /*送られてきた画像データの余分な部分を取り除く*/
  let position_image = req.body.position_image;
  let aim_image = req.body.aim_image;
  let landing_image = req.body.landing_image;
  /*fs.writeFile("file.txt", position_image, (err) => {
    if(err) throw err;
    console.log("書き込み完了");
  });*/


  //console.log(position_image);
  //let test = "data:image/png;base64,abcd"
  //test = test.replace(/data:.*\/.*;base64,/, '');
  //console.log(test);
  //console.log("before: " + position_image.slice(0, 20));
  position_image = position_image.replace(/data:image\/.*;base64,/, '');
  //console.log("----------------")
  //console.log("after: " + position_image.slice(0, 20));
  //console.log(position_image_base64);

  /*画像をimgurに登録*/
  access_token = await generateAccessToken(refresh_token, client_id, client_secret);
  const upload_url = "https://api.imgur.com/3/upload";
  const headers = {"Authorization": "Bearer " + access_token};
  var upload_params = new URLSearchParams();
  upload_params.append("image", position_image);
  upload_params.append("type", "base64");
  //upload_params.append("name", test.png);
  await axios.post(upload_url, upload_params, {headers: headers})
  .then((r) => {
    console.log("upload success");
    //console.log(res.data);
    //console.log(res.data.data);
    console.log(r.data.data.link);
    const position_image_url = r.data.data.link;
    console.log(position_image_url);
    connection.query(
      'INSERT INTO ' + table_name + ' (map, agent, skill, position_image, aim_image, landing_image, content) VALUES (?,?,?,?,?,?,?)',
      [req.body.map, req.body.agent, req.body.skill, position_image_url, req.body.aim_image, req.body.landing_image, req.body.content],
      (error, results) => {
        if(error) {
          console.log(error)
          res.send(error);
        } else {
          console.log('insert new data success')
          res.send(results);
        }
      }
    )
  })
  .catch((error) => {
    console.log("upload error");
    console.log(error);
  })
  // uploadImageForImgurを呼び出すと画像urlを返すのを待ってくれない。なぜ？
  /*uploadImageForImgur(position_image, access_token).then((position_image_url) => {
    console.log("処理待てや")
    console.log(position_image_url);
    connection.query(
      'INSERT INTO ' + table_name + ' (map, agent, skill, position_image, aim_image, landing_image, content) VALUES (?,?,?,?,?,?,?)',
      [req.body.map, req.body.agent, req.body.skill, position_image_url, req.body.aim_image, req.body.landing_image, req.body.content],
      (error, results) => {
        if(error) {
          console.log(error)
          res.send(error);
        } else {
          console.log('insert new data success')
          res.send(results);
        }
      }
    )
  });*/



  //画像のurlをdbに保存

  

  //res.send(req.body)
});

app.post('/api/update', (req, res) => {
  console.log('---------connect-----------')
  console.log(req.body);
  console.log('---------connect-----------')
  //console.log(Object.values(req.body))
  //console.log(req.body.content);
  connection.query(
    'UPDATE ' + table_name + 
    ' SET map=?, agent=?, skill=?, position_image=?, aim_image=?, landing_image=?, content=? WHERE id=?',
    [req.body.map, req.body.agent, req.body.skill, req.body.position_image, req.body.aim_image, req.body.landing_image, req.body.content, req.body.id],
    (error, results) => {
      if(error) {
        console.log('error')
        res.send(error);
      } else {
        console.log('success');
        res.send(results);
      }
    }
  )
});

app.delete('/api/delete/:id', (req, res) => {
  //メモを削除する処理
  console.log('---------delete--------');
  console.log(req.params.id);
  connection.query(
    'DELETE FROM ' + table_name + ' WHERE id=?',
    [req.params.id],
    (error, results) => {
      if(error) {
        res.send(error);
      } else {
        res.send(results);
      }
    }
  );
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});