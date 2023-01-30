const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const auth = false;

  console.log(req.cookies);
  const token = req.cookies.token;
  console.log(token);

  if(!token) {
    console.log("権限がありません")
    res.status(400).json([
      {
        message: "権限がありません",
      },
    ]);
  } else {
    try {
      let username = await JWT.verify(token, "SECRET_KEY");
      console.log(username);
      console.log("token認証成功")
      next();
    } catch {
      console.log("token認証失敗")
      res.status(400).json([
        {
          message: "tokenが一致しません",
        },
      ])
    }
  }
}