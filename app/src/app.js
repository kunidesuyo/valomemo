const express = require('express')
const app = express()
const port = 80

console.log('app-----------------')
console.log(app)

// なくても動くけど一応
app.set('view engine', 'ejs')

// viewsの参照先を変更
app.set('views', '/usr/app/src/views')

app.get('/', (req, res) => {
  //res.send('test complete')
  res.render('hello.ejs');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})