const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
  //res.send('test complete')
  res.render('hello.ejs');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})