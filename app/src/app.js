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
const deleteImageForImgur = handleImgurApi.deleteImageForImgur;

const common_info = JSON.parse(fs.readFileSync("/usr/app/common_info/common_info.json"));
  

//let access_token = "";

app.get('/query-test', () => {
  let createQuery = 'INSERT INTO ' + table_name + ' ';
  createQuery += '('
  let len = common_info.setup_list_column_name.length;
  for(let i = 0; i < len; i++) {
    if(common_info.setup_list_column_name[i] !== "id") {
      createQuery += common_info.setup_list_column_name[i];
      if(i !== len-1) createQuery += ", ";
    }
  }
  createQuery += ') VALUES ('
  for(let i = 0; i < len-1; i++) {
    createQuery += '?';
    if(i !== len-2) createQuery += ',';
  }
  createQuery += ')'
  console.log(createQuery);
});




//api
app.get('/api/read', (req, res) => {
  connection.query(
    'SELECT * FROM ' + table_name,
    (error, results) => {
      console.log("--------read-------")
      console.log(results);
      res.send(results);
    }
  )
});

app.post('/api/create', async (req, res) => {
  console.log('-----------api create start------------');
  //バリデーションチェック追加予定

  /*送られてきた画像データの余分な部分を取り除く*/
  let position_image = req.body.position_image;
  let aim_image = req.body.aim_image;
  let landing_image = req.body.landing_image;

  position_image = await position_image.replace(/data:image\/.*;base64,/, '');
  aim_image = await aim_image.replace(/data:image\/.*;base64,/, '');
  landing_image = await landing_image.replace(/data:image\/.*;base64,/, '');

  /*画像をimgurに登録*/
  await generateAccessToken(client_id, client_secret);
  /* uploadImageForImgur */
  //現実(動く)
  let position_image_url, aim_image_url, landing_image_url;
  const [access_token, refresh_token] = getNowTokens();
  const upload_url = "https://api.imgur.com/3/upload";
  const headers = {"Authorization": "Bearer " + access_token};
  var upload_params_position = new URLSearchParams();
  upload_params_position.append("image", position_image);
  upload_params_position.append("type", "base64");
  await axios.post(upload_url, upload_params_position, {headers: headers})
  .then((r) => {
    console.log("upload success");
    position_image_url = r.data.data.link;
    console.log(position_image_url);
  })
  .catch((error) => {
    console.log("upload error");
    console.log(error);
  })

  var upload_params_aim = new URLSearchParams();
  upload_params_aim.append("image", aim_image);
  upload_params_aim.append("type", "base64");
  await axios.post(upload_url, upload_params_aim, {headers: headers})
  .then((r) => {
    console.log("upload success");
    aim_image_url = r.data.data.link;
    console.log(aim_image_url);
  })
  .catch((error) => {
    console.log("upload error");
    console.log(error);
  })

  var upload_params_landing = new URLSearchParams();
  upload_params_landing.append("image", landing_image);
  upload_params_landing.append("type", "base64");
  await axios.post(upload_url, upload_params_landing, {headers: headers})
  .then((r) => {
    console.log("upload success");
    landing_image_url = r.data.data.link;
    console.log(landing_image_url);
  })
  .catch((error) => {
    console.log("upload error");
    console.log(error);
  })

  /* queryを作る */
  let createQuery = 'INSERT INTO ' + table_name + ' ';
  createQuery += '('
  let len = common_info.setup_list_column_name.length;
  for(let i = 0; i < len; i++) {
    if(common_info.setup_list_column_name[i] !== "id") {
      createQuery += common_info.setup_list_column_name[i];
      if(i !== len-1) createQuery += ", ";
    }
  }
  createQuery += ') VALUES ('
  for(let i = 0; i < len-1; i++) {
    createQuery += '?';
    if(i !== len-2) createQuery += ',';
  }
  createQuery += ')'
  console.log(createQuery);

  let insertData = {};

  common_info.setup_list_column_name.map((key) => {
    if(key !== "id") {
      insertData[key] = req.body[key];
    }
  });

  /* imageはurlを入れる */
  insertData["position_image"] = position_image_url;
  insertData["aim_image"] = aim_image_url;
  insertData["landing_image"] = landing_image_url;

  console.log(Object.values(insertData));

  connection.query(
    createQuery,
    Object.values(insertData),
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


  /*
  //理想(~_image_urlがundefinedでconnection.queryが呼び出される)
  const position_image_url = await uploadImageForImgur(position_image);
  const aim_image_url = await uploadImageForImgur(aim_image);
  const landing_image_url = await uploadImageForImgur(landing_image);

  await connection.query(
    'INSERT INTO ' + table_name + ' (map, agent, skill, position_image, aim_image, landing_image, content) VALUES (?,?,?,?,?,?,?)',
    [req.body.map, req.body.agent, req.body.skill, position_image_url, aim_image_url, landing_image_url, req.body.content],
    (error, results) => {
      if(error) {
        console.log(error)
        res.send(error);
      } else {
        console.log('insert new data success')
        res.send(results);
      }
    }
  )*/

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

app.delete('/api/delete/:id', async (req, res) => {
  //メモを削除する処理
  console.log('---------delete--------');
  console.log(req.params.id);
  // idから対象データを取得
  await connection.query(
    'SELECT * FROM ' + table_name + ' WHERE id=?',
    [req.params.id],
    async (error, result) => {
      if(error) {
        console.log("error");
        console.log(error);
      } else {
        console.log("success");
        //console.log(result);
        const setupData = result[0];      
        //console.log(setupData);
        //console.log(setupData.position_image);
        //console.log(setupData.aim_image);
        //console.log(setupData.landing_image);
        //apiに削除要請
        await deleteImageForImgur(setupData.position_image);
        await deleteImageForImgur(setupData.aim_image);
        await deleteImageForImgur(setupData.landing_image);
      }
    }
  );

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


app.get('/imgur-test', async (req, res) => {

  //fs.writeFileSync("./src/test.txt", "bbb");

  //[access_token, refresh_token] = getNowTokens();
  //let tokens = getNowTokens();
  //console.log(tokens);
  //console.log("access_token: " + access_token);
  //console.log("refresh_token: " + refresh_token);
  //generateAccessToken(client_id, client_secret);



  //const image = fs.readFileSync('/usr/app/src/testdata/test1-3.png', 'base64');
  //const image_url = "https://i.imgur.com/f3hTO3S.png";
  //deleteImageForImgur(image_url);

  //uploadImageForImgur(image);

});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});