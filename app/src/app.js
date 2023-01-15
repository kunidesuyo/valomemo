const express = require('express');
const app = express();
const port = 80;

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

app.get('/list', (req, res) => {
  connection.query(
    'SELECT * FROM ' + table_name,
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
  connection.query(
    'INSERT INTO ' + table_name + ' (content) VALUES (?)',
    [req.body.content],
    (error, results) => {
      //一覧画面を表示
      res.redirect('/list');
    }
  );
});

app.post('/delete/:id', (req, res) => {
  //メモを削除する処理
  connection.query(
    'DELETE FROM ' + table_name + ' WHERE id=?',
    [req.params.id],
    (error, results) => {
      res.redirect('/list');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM ' + table_name + ' WHERE id=?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE ' + table_name + ' SET content=? WHERE id=?',
    [req.body.content, req.params.id],
    (error, results) => {
      res.redirect('/list');
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});