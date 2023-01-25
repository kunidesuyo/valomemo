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

/*
// table初期化
connection.query(
  //?でtable_nameを入れると「'」で囲まれる
  'CREATE TABLE '+ table_name + ' (id INT AUTO_INCREMENT, content TEXT, PRIMARY KEY (id))',
  (error, result) => {
    if(error) {
      console.log(error);
    } else {
      console.log('table created');
      connection.query(
        'INSERT INTO ' + table_name + ' (content) VALUES ("test")',
        (error, result) => {
          if(error) {
            console.log(error);
          } else {
            console.log('inserted test data');
          }
        }
      );
    }
  }
);
*/

// なくても動くけど一応
app.set('view engine', 'ejs');

// viewsの参照先を変更
app.set('views', '/usr/app/src/views');

//cssとimageを使用可能にする
app.use(express.static('/usr/app/src/public'));

//フォームの値を受け取るための文
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  //res.send('test complete')
  res.render('hello.ejs');
});

/*app.get('/list', (req, res) => {
  connection.query(
    'SELECT * FROM ' + table_name,
    (error, results) => {
      res.render('list.ejs', {items: results})
    }
  );
});*/

/*app.get('/create', (req, res) => {
  res.render('create.ejs');
});*/

/*app.post('/create', (req, res) => {
  //dbに追加
  connection.query(
    'INSERT INTO ' + table_name + ' (content) VALUES (?)',
    [req.body.content],
    (error, results) => {
      //一覧画面を表示
      res.redirect('/list');
    }
  );
});*/

/*app.post('/delete/:id', (req, res) => {
  //メモを削除する処理
  connection.query(
    'DELETE FROM ' + table_name + ' WHERE id=?',
    [req.params.id],
    (error, results) => {
      res.redirect('/list');
    }
  );
});*/

/*app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM ' + table_name + ' WHERE id=?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});*/

/*app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE ' + table_name + ' SET content=? WHERE id=?',
    [req.body.content, req.params.id],
    (error, results) => {
      res.redirect('/list');
    }
  );
});*/

app.get('/connect', (req, res) => {
  console.log("connect test");
  res.json({id: 2, content: "connect test"});
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

app.post('/api/create', (req, res) => {
  console.log('create connect------------');
  console.log(req.body);
  //バリデーションチェック追加予定
  //console.log(req.body.content);
  connection.query(
    'INSERT INTO ' + table_name + ' (map, agent, skill, position_image, aim_image, landing_image, content) VALUES (?,?,?,?,?,?,?)',
    [req.body.map, req.body.agent, req.body.skill, req.body.position_image, req.body.aim_image, req.body.landing_image, req.body.content],
    (error, results) => {
      if(error) {
        console.log(error)
        res.send(error);
      } else {
        console.log('success')
        res.send(results);
      }
    }
  )
  //res.send(req.body)
});

app.post('/api/update', (req, res) => {
  console.log('---------connect-----------')
  console.log(req.body);
  console.log('---------connect-----------')
  //console.log(Object.values(req.body))
  //console.log(req.body.content);
  connection.query(
    //queryを変数にしたい
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

// imgur api

const refresh_token = process.env.IMGUR_API_REFRESH_TOKEN;
const client_id = process.env.IMGUR_API_CLIENT_ID;
const client_secret = process.env.IMGUR_API_CLIENT_SECRET;

//import axios from 'axios';
const axios = require('axios');
const fs = require('fs');


let access_token = "";

app.get('/imgur-test', async (req, res) => {
  //console.log(refresh_token);
  //console.log(client_id);
  //console.log(client_secret);
  var params = new URLSearchParams();
  params.append("refresh_token", refresh_token);
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("grant_type", "refresh_token");
  await axios.post("https://api.imgur.com/oauth2/token", params)
  .then((res) => {
    console.log("get token success");
    //console.log(res.data);
    access_token = res.data.access_token;
  })
  .catch((error) => {
    console.log("get token error");
    console.log(error);
  })
  //console.log(access_token);
  const image = fs.readFileSync('/usr/app/src/testdata/test.png', 'base64');
  //console.log(image);
  const upload_url = "https://api.imgur.com/3/upload";
  const headers = {"Authorization": "Bearer " + access_token};
  var upload_params = new URLSearchParams();
  upload_params.append("image", image);
  upload_params.append("type", "base64");
  //upload_params.append("name", test.png);
  await axios.post(upload_url, upload_params, {headers: headers})
  .then((res) => {
    console.log("upload success");
    console.log(res);
  })
  .catch((error) => {
    console.log("upload error");
    console.log(error);
  })

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});