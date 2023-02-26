const express = require('express');
const app = express();
const port = 8080;

const mysql = require('mysql');

const table_name = process.env.TABLE_NAME;

const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const cors = require('cors');
const cookieParser = require('cookie-parser');

// const connection = mysql.createConnection({
//   host: process.env.DB_CONTAINER_NAME, 
//   //コンテナ名を指定(同ネットワーク内なので名前解決できる？)
//   user: 'root',
//   //password: 'password',
//   password: process.env.MYSQL_ROOT_PASSWORD,
//   database: process.env.MYSQL_DATABASE
// });

const Setup = require('./db/models/Setup');
const User = require('./db/models/User');

const migration_db = require('./db/migration_db');
migration_db();
//
// let Setup;
// let User;
/*Setup.sync({alter: true})
.then((result) => {
  console.log("migration db success");
  console.log(result);
})
.catch((error) => {
  console.log("migration db error");
  console.log(error);
})*/


// connection.connect((error) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('db connected');
//   }
// });


// なくても動くけど一応
app.set('view engine', 'ejs');

// viewsの参照先を変更
app.set('views', '/usr/api/src/views');

//cssとimageを使用可能にする
app.use(express.static('/usr/api/src/public'));

//フォームの値を受け取るための文
app.use(express.urlencoded({extended: false, limit: '20mb'}));

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}))

//リクエストからクッキーを読み取る
app.use(cookieParser());


/*app.get('/', (req, res) => {
  //res.send('test complete')
  res.render('hello.ejs');
});*/

const path = require("path");
app.use("/static", express.static(path.join(__dirname, "build", "static")));
app.use("/images", express.static(path.join(__dirname, "build", "images")));


app.get('/health', (req, res) => {
  console.log("healthy")
  res.status(200);
});

app.all('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "build", "index.html"));
});

app.all('/read', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.all('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.all('/register', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.all('/create', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.all('/update', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// imgur api
//const client_id = process.env.DEV_IMGUR_API_CLIENT_ID;
//const client_secret = process.env.DEV_IMGUR_API_CLIENT_SECRET;

const axios = require('axios');
const fs = require('fs');
const handleImgurApi = require('./handleImgurApi.js');
const generateAccessToken = handleImgurApi.generateAccessToken;
const uploadImageForImgur = handleImgurApi.uploadImageForImgur;
const getNowTokens = handleImgurApi.getNowTokens;
const deleteImageForImgur = handleImgurApi.deleteImageForImgur;

const common_info = JSON.parse(fs.readFileSync("/usr/api/common_info/common_info.json"));
  

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
  Setup.findAll()
  .then((result) => {
    console.log("read success");
    //console.log(result);
    res.send(result);
  })
  .catch((error) => {
    console.log("read error");
    console.log(error);
    res.status(400).json({message: "DBエラー"});
  });
  /*connection.query(
    'SELECT * FROM ' + table_name,
    (error, results) => {
      console.log("--------read-------")
      console.log(results);
      res.send(results);
    }
  )*/
});

app.post('/api/create', auth, async (req, res) => {
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
  await generateAccessToken();
  /* uploadImageForImgur */
  //現実(動く)
  let position_image_url, aim_image_url, landing_image_url;
  const [access_token, refresh_token] = await getNowTokens();
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
  /*let createQuery = 'INSERT INTO ' + table_name + ' ';
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
  createQuery += ')'*/
  //console.log(createQuery);

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


  JWT.verify(req.cookies.token, JWTSecretKey, (error, decode) => {
    if(error) {
      console.log("token認証失敗")
      return res.status(400).json([{message: "tokenが一致しません",},]);
    }
    insertData["created_by"] = decode.username;
    //console.log(Object.values(insertData));
    //console.log("createQuery: " + createQuery);
    console.log("insertData: ");
    console.log(insertData);
    Setup.create(insertData)
    .then((result) => {
      console.log("create success");
      //console.log(result);
      res.status(200).json([{message: "新しいセットアップ作成成功"}]);
    })
    .catch((error) => {
      console.log("create error");
      console.log(error);
      res.status(400).json([{message: "セットアップ作成失敗"}]);
    })
    /*connection.query(
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
    )*/
  })
  




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

app.put('/api/update', auth, async (req, res) => {
  console.log('---------update-----------')

  // requestしたユーザーと更新するセットアップのcreated_byが一致するか検証
  await JWT.verify(req.cookies.token, JWTSecretKey, (error, decode) => {
    if(error) {
      console.log("token認証失敗")
      return res.status(400).json([{message: "tokenが一致しません",},]);
    }

    Setup.findOne({where: {id: req.body.id}})
    .then((result) => {
      //console.log(result);
      if(result === null) {
        console.log("データが存在しません")
        return res.status(400).json([{message: "データが存在しません"}])
      }
      console.log("db data's createdby: ")
      console.log(result.created_by);
      console.log("decode's username: ")
      console.log(decode.username);
      if(result.created_by !== decode.username){
        console.log("作成したユーザーではないため更新できません")
        return res.status(400).json([{message: "作成したユーザーではないため更新できません",},]);
      } else {
        let insertData = {};
        common_info.setup_list_column_name.map((key) => {
          if(key !== "id") {
            insertData[key] = req.body[key];
          }
        });
        insertData["id"] = req.body["id"];
        console.log(insertData);

        Setup.update(insertData, {where: {id: req.body.id}})
        .then((result) => {
          console.log("update success");
          //console.log(result);
          res.status(200).json([{message: "セットアップの更新が成功しました"}])
        })
        .catch((error) => {
          console.log("db error2");
          console.log(error);
          res.status(400).json([{message: "db error"}]);
        })
      }
    })
    .catch((error) => {
      console.log("db error1");
      return res.status(400).json([{message: "db error"}])
    })
  })
});

app.delete('/api/delete/:id', auth, async (req, res) => {
  //メモを削除する処理
  console.log('---------delete--------');
  console.log(req.params.id);
  // idから対象データを取得

  await JWT.verify(req.cookies.token, JWTSecretKey, async (error, decode) => {
    if(error) {
      console.log("token認証失敗")
      return res.status(400).json([{message: "tokenが一致しません",},]);
    }
    Setup.findOne({where: {id: req.params.id}})
    .then(async (result) => {
      //console.log(result);
      if(result === null) {
        console.log("データが存在しません")
        return res.status(400).json([{message: "データが存在しません"}])
      }
      console.log("db data's createdby: ")
      console.log(result.created_by);
      console.log("decode's username: ")
      console.log(decode.username);
      if(result.created_by !== decode.username){
        console.log("作成したユーザーではないため削除できません")
        return res.status(400).json([{message: "作成したユーザーではないため削除できません",},]);
      } else {
        console.log("作成したユーザーなので対象のデータを削除します");
        //apiに削除要請
        await deleteImageForImgur(result.position_image);
        await deleteImageForImgur(result.aim_image);
        await deleteImageForImgur(result.landing_image);
        //dbから削除
        Setup.destroy({where: {id: req.params.id}})
        .then((result) => {
          console.log("delete success");
          console.log(result);
          return res.status(200).json([{message: "セットアップの削除に成功しました"}]);
        })
        .catch((error) => {
          console.log("delete error (db)");
          console.log(error);
          return res.status(400).json([{message: "dbエラー"}]);
        })
      }
    })
  })
});


app.get('/imgur-test', async (req, res) => {

  //fs.writeFileSync("./src/test.txt", "bbb");

  //[access_token, refresh_token] = getNowTokens();
  //let tokens = getNowTokens();
  //console.log(tokens);
  //console.log("access_token: " + access_token);
  //console.log("refresh_token: " + refresh_token);
  //generateAccessToken(client_id, client_secret);



  //const image = fs.readFileSync('/usr/api/src/testdata/test1-3.png', 'base64');
  //const image_url = "https://i.imgur.com/f3hTO3S.png";
  //deleteImageForImgur(image_url);

  //uploadImageForImgur(image);

});

const JWTSecretKey = process.env.JWT_SECRET_KEY

app.post('/api/login', (req, res) => {
  console.log(req.body);
  //console.log("secret key", JWTSecretKey);
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({where: {username: username}})
  .then(async (result) => {
    console.log(result.username);
    if(result === null) {
      console.log("ユーザーが存在しません")
      return res.status(400).json([{message: "ユーザーが見つかりません"}]);
    }
    console.log("認証処理");
    //パスワードの複合と照合
    const isMatchPassword = await bcrypt.compare(password, result.password);
    if(!isMatchPassword) {
      console.log("パスワードが違います");
      return res.status(400).json([{message: "パスワードが違います"}]);
    } else {
      //JWTのtokenを発行
      console.log("ログイン成功");
      const token = await JWT.sign({
        username,
      },
      //.envで管理
      JWTSecretKey,
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
          message: "ログインに成功しました",
          username: username,
        }
      ]);
    }
  })
  .catch((error) => {
    console.log("ユーザーが存在しません");
    return res.status(400).json([{message: "ユーザーが見つかりません"}]);
  })
});

//環境変数で管理
const max_num_of_user = process.env.MAX_NUM_OF_USER;
//const max_num_of_user = 100;

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

  User.findOne({where: {username: username}})
  .then((result) => {
    console.log(result);
    if(result === null) {
      console.log("同じ名前のユーザーが存在しない");
      //ユーザー数が制限を超えていないか調べる
      User.findAll()
      .then(async (allUsers) => {
        //console.log(allUsers.length);
        if(allUsers.length >= max_num_of_user) {
          return res.status(400).json([{message: "これ以上ユーザーを作れません"}]);
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        //dbへ新しいユーザーを保存する
        const newUser = {username: username, password: hashedPassword};
        User.create(newUser)
        .then(async (r)=> {
          console.log("ユーザー作成完了");
          console.log(r);
          //token発行
          const token = await JWT.sign({
            username,
          },
          JWTSecretKey,
          {
            expiresIn: "1h",
          }
          );
          res.cookie('token', token, {httpOnly: true});
          return res.status(200).json([{message: "アカウントの登録が完了しました", username: username}]);
        })
      })
    } else {
      console.log("同じ名前のユーザーが既に存在しています");
      return res.status(400).json([{message: "同じ名前のユーザーが既に存在しています"}]);
    }
  })
  .catch((error) => {
    console.log("error");
    console.log(error);
    return res.status(400).json([{message: "dbエラー"}])
  })

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
      let username = await JWT.verify(token, JWTSecretKey);
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