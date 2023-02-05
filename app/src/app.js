const express = require('express');
const app = express();
const port = 8080;

const mysql = require('mysql');

const table_name = process.env.TABLE_NAME;

const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const cors = require('cors');
const cookieParser = require('cookie-parser');

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

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}))

//リクエストからクッキーを読み取る
app.use(cookieParser());


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


const auth = require("./middleware/AuthByJWT")


//api
app.get('/api/read', auth, (req, res) => {
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

app.put('/api/update', (req, res) => {
  console.log('---------connect-----------')
  console.log(req.body);
  console.log('---------connect-----------')
  //console.log(Object.values(req.body))
  //console.log(req.body.content);

  /* queryを作る */
  let updateQuery = 'UPDATE ' + table_name + ' SET ';
  let len = common_info.setup_list_column_name.length;
  for(let i = 0; i < len; i++) {
    if(common_info.setup_list_column_name[i] !== "id") {
      updateQuery += common_info.setup_list_column_name[i];
      updateQuery += '=?';
      if(i !== len-1) updateQuery += ',';
      updateQuery += ' ';
    }
  }
  updateQuery += 'WHERE id=?'
  console.log(updateQuery);

  let insertData = {};

  common_info.setup_list_column_name.map((key) => {
    if(key !== "id") {
      insertData[key] = req.body[key];
    }
  });
  insertData["id"] = req.body["id"];

  console.log(insertData);
  console.log(Object.values(insertData));

  connection.query(
    updateQuery,
    Object.values(insertData),
    (error, results) => {
      if(error) {
        console.log('error')
        console.log(error);
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

app.post('/api/login', (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (error, results) => {
      if(error) {
        console.log("db error");
        res.status(400).json([
          {
            message: "DBエラー"
          }
        ])
      }
      if(results.length > 0) {
        console.log("認証処理");
        //パスワードの複合と照合
        const isMatchPassword = await bcrypt.compare(password, results[0].password);
        if(!isMatchPassword) {
          console.log("パスワードが違います");
          res.status(400).json([
            {
              message: "パスワードが違います"
            }
          ])
        } else {
          //JWTのtokenを発行
          console.log("ログイン成功");
          const token = await JWT.sign({
            username,
          },
          //.envで管理
          "SECRET_KEY",
          {
            expiresIn: "1h",
          }
          );
          //Set-cookieヘッダーにtokenをセットする処理
          //httpOnlyをtrueにすることでhttp通信するときのみ参照できるようになる
          console.log(token);
          res.cookie('token', token, {httpOnly: true});
          return res.status(200).json([
            {
              message: "ログインに成功しました"
            }
          ]);
        }

      } else {
        console.log("ユーザーが見つかりません");
        res.status(400).json([
          {
            message: "ユーザーが見つかりません"
          }
        ])
      }
    }
  )
});


app.post('/api/register', async (req, res) => {
  console.log("register");
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  //バリデーションチェック
  if(username === "" || password === "") {
    return res.status(400).json({message: "入力値が無効です"})
  }
  //dbにユーザーが存在しているか確認
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (error, results) => {
      if(results.length > 0) {
        console.log("ユーザーが既に存在している")
        return res.status(400).json([
          {
            message: "すでにそのユーザーは存在しています"
          }
        ])
      }
      console.log("ユーザーが存在しないので登録が可能です");
      let hashedPassword = await bcrypt.hash(password, 10);
      //console.log(hashedPassword)
//
      // dbへ保存する
      connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        async (error, results) => {
          if(error) {
            console.log("db error");
            console.log(error);
            res.status(400).json([
              {
                message: "DBへの保存に失敗しました"
              }
            ])
          } else {
            console.log("dbへの保存完了");
            //token発行
            const token = await JWT.sign({
              username,
            },
            //.envで管理
            "SECRET_KEY",
            {
              expiresIn: "1h",
            }
            );
            res.cookie('token', token, {httpOnly: true});
            return res.json({token});
          }
        }
      )
    }
  )
});

app.post("/api/logout", (req, res) => {
  console.log("connect");
  res.clearCookie("token");
  res.status(200).json([{message: "ログアウトしました。"}])
});


/*app.post("/api/is-auth", async (req, res) => {
  //res.json([{message: "is auth ok"}]);
  const token = req.cookies.token;
  if(!token) {
    console.log("認証されていません(tokenなし)");
    res.status(200).json([
      {
        isAuth: false,
      }
    ]);
  } else {
    try {
      let username = await JWT.verify(token, "SECRET_KEY");
      console.log(username);
      console.log("認証されています");
      res.status(200).json([
        {
          isAuth: true,
        }
      ]);
    } catch {
      console.log("認証されていません(tokenあり)");
      res.status(200).json([
        {
          isAuth: false,
        }
      ]);
    }
  }
})*/


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});