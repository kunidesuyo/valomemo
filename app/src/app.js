const express = require('express');
const app = express();
const port = 80;

const mysql = require('mysql');

//dbコンテナが完全に立ち上がるまで待たないといけない

const connection = mysql.createConnection({
  host: 'valomemo-db-1', 
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

// table初期化
connection.query(
  'CREATE TABLE memos (id INT AUTO_INCREMENT, content TEXT, PRIMARY KEY (id))',
  (error, result) => {
    if(error) {
      console.log(error);
    } else {
      console.log('table created');
      connection.query(
        'INSERT INTO memos(content) VALUES ("test")',
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

app.get('/db-test', (req, res) => {
  //dbから情報を持ってきて出力
  connection.query(
    'SELECT * FROM memos',
    (error, results) => {
      console.log(results);
    }
  );
});

app.get('/list', (req, res) => {
  connection.query(
    'SELECT * FROM memos',
    (error, results) => {
      res.render('list.ejs', {items: results})
    }
  );
});

app.get('/create', (req, res) => {
  res.render('create.ejs');
});

app.post('/create', (req, res) => {
  //dbに追加
  //console.log(req.body.content);
  connection.query(
    'INSERT INTO memos (content) VALUES (?)',
    [req.body.content],
    (error, results) => {
      //一覧画面を表示
      res.redirect('/list');
    }
  );
});

app.post('/delete/:id', (req, res) => {
  //メモを削除する処理
  //console.log(req.params.id);
  connection.query(
    'DELETE FROM memos WHERE id=?',
    [req.params.id],
    (error, results) => {
      res.redirect('/list');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM memos WHERE id=?',
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  //console.log(req.body.content);
  connection.query(
    'UPDATE memos SET content=? WHERE id=?',
    [req.body.content, req.params.id],
    (error, results) => {
      res.redirect('/list');
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});