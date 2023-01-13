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
  'CREATE TABLE memos (id INT AUTO_INCREMENT, memo TEXT, PRIMARY KEY (id))',
  (error, result) => {
    if(error) {
      console.log(error);
    } else {
      console.log('table created');
      connection.query(
        'INSERT INTO memos(memo) VALUES ("test")',
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
      res.render('index.ejs', {items: results})
    }
  )
});

app.get('/add-data', (req, res) => {
  connection.query(
    'INSERT INTO memos(memo) VALUES ("kuni")',
    (error, results) => {
      if(error) {
        console.log(error);
      } else {
        console.log('add data success')
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});