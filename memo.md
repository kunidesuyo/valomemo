# メモ
## docker
### container関連
- コンテナ作成  
`docker container run -d --rm --name node-test -it node:latest`  
- コンテナ操作  
`docker container exec -it node-test /bin/sh`
### Dockerfile
- imageをビルド  
`docker image build ./ -t node-test`
- imageからコンテナ作成  
`docker container run -d --rm --name node-test -it node-test`
### Docker-compose
- compose  
`docker-compose up -d --build`

### db container
- mysqlコンテナを公式imageから作成  
`docker container run -d --rm -e MYSQL_ROOT_PASSWORD="password" -p 3306:3306 --name mysql-test -it mysql`

- docker-compose-test.ymlと同じ処理をするコマンド
`docker container run -d --rm -e MYSQL_ROOT_PASSWORD="password" -p 3306:3306 --mount type=bind,source=C:\Users\Kuni\MyHome\valomemo\db\conf,target=/etc/mysql/conf.d/,readonly --name mysql-test -it mysql:8.0.31`

### mysql container
#### docker container run で立てたコンテナはコンテナ内部からmysqlにログインできるがdocker composeで立てたコンテナはmysqlにログインできない  
エラーコード  
`ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)`
- volume,networkをprune後起動してみたができないまま  
- mysql:5.7でやってみたが同じ
- MYSQLD_OPTS="--skip-grant-tables"(パスワード認証を無効化)を設定してみたがだめ
runコマンドは起動したばかりはパスなしで行けたが少し時間が経つといけなくなる？？？

- 解決策
環境変数の指定で値を「"」で囲まない

#### mysqlコマンド
- 認証プラグインの確認
`SELECT User, Host, Plugin FROM mysql.user;`