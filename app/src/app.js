const express = require('express');
const app = express();
const port = 80;

const mysql = require('mysql');

const connection = mysql.createConnection({
  //host: 'mysql-test',
  host: 'localhost',
  //port: '3306',
  user: 'kuni',
  password: 'password'
});
//

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

app.get('/', (req, res) => {
  //res.send('test complete')
  res.render('hello.ejs');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});