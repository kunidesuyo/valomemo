# docker
## container関連
- コンテナ作成  
`docker container run -d --rm --name node-test -it node:latest`  
- コンテナ操作  
`docker container exec -it node-test /bin/sh`
- コンテナからファイルをホストにコピー
`docker container cp <コピー元> <コピー先>`
## Dockerfile
- imageをビルド  
`docker image build ./ -t node-test`
- imageからコンテナ作成  
`docker container run -d --rm --name node-test -it node-test`
## Docker-compose
- compose  
`docker compose up -d --build`

## db container
- mysqlコンテナを公式imageから作成  
`docker container run -d --rm -e MYSQL_ROOT_PASSWORD="password" -p 3306:3306 --name mysql-test -it mysql`

- docker-compose-test.ymlと同じ処理をするコマンド
`docker container run -d --rm -e MYSQL_ROOT_PASSWORD="password" -p 3306:3306 --mount type=bind,source=C:\Users\Kuni\MyHome\valomemo\db\conf,target=/etc/mysql/conf.d/,readonly --name mysql-test -it mysql:8.0.31`

- バックアップ
ホスト`docker exec valomemo_db bash -c "mysqldump -uroot -ppassword valomemo_db > test.sql`  

- コンテナ起動時に/docker-entrypoint-initdb.dフォルダ内のsqlファイルを実行してくれる
バックアップしたsqlファイルを上記フォルダに配置すれば復元できる

## mysql container
### docker container run で立てたコンテナはコンテナ内部からmysqlにログインできるがdocker composeで立てたコンテナはmysqlにログインできない  
エラーコード  
`ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)`
- volume,networkをprune後起動してみたができないまま  
- mysql:5.7でやってみたが同じ
- MYSQLD_OPTS="--skip-grant-tables"(パスワード認証を無効化)を設定してみたがだめ
runコマンドは起動したばかりはパスなしで行けたが少し時間が経つといけなくなる？？？

- 解決策
docker-compose.ymlファイルにて、環境変数の値を「"」で囲まない

### mysqlコマンド
- 認証プラグインの確認  
`SELECT User, Host, Plugin FROM mysql.user;`

# Node.js
## mysqlが起動するのを待ってnode.jsを起動する
depends onでコンテナの起動順序を指定したが、コンテナ内のmysqlが完全に起動するのを待ってnodejsが起動する訳では無い。
[参考](https://zenn.dev/akira_kashihara/articles/e7bbbcf55a936a#fn-2988-2)

　　
healthcheckで実現
[参考](https://docs.docker.jp/engine/reference/builder.html#healthcheck)
[参考2](https://qiita.com/knjname/items/9c0a89af2d9e49749017)

# React
## react-router-dom v6が上手く動かない
`<Route />`単体でも`<Routes><\Routes>`で囲まないといけない