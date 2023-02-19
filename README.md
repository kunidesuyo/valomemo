# DB
## DBの更新作業
- カラムをいじる場合(追加、変更、削除)
  - './common_info/common_info.json'を変更
  - './db/docker-entrypoint-initdb.d'のsqlファイルを変更
    - (要検証)データが多い場合、composeで立ち上げてdbを直接操作。mysqldumpでできたsqlファイルを用いる。
  - フロントの表示変更

## アカウント管理
- ログイン時にJWTを発行してcookieに保存する。(有効期限は1h)
- localStorageの"username"にユーザー名を入れる

- 画面へのアクセスの際localStorageの"username"をみてアクセス制御。
  - 入っていた場合はそのまま表示。
    - JWTが有効の場合はapiと通信できる。
    - JWTが無効の場合はlogin画面に誘導
  - 空の場合はlogin画面へ遷移

- ログアウト時にcookieを削除
- localStorageの"username"を""(空)にする。
- api側でJWTを無効化(未実装)


# TODO


- home画面を作る
  - login画面へのリンク
  - register画面へのリンク
- not found画面作る
- docker compose downするときにdbのバックアップを作成するようにする
  - docker compose down し忘れたとき(バックアップがされなかったとき)の復元
    - apiのtoken系は再発行手順を書いておく
- (setupcardコンポーネント)ユーザー名が一致しないセットアップでは編集、削除ボタンを表示しないようにする
- readme.mdを作成(人に見せられるもの)
- apiのレスポンスを整える(messageに内容を入れ、frontendでその内容を表示するようにする)
- コードのリファクタリング
  - createUpdateでpostDataとupdateDataをまとめる
- cardのbackdropで高さをレスポンシブに対応
- mypage作成
  - 投稿したセットアップの表示
  - 作成したmylistの表示
- search画面
- mylist機能
- userの権限を実装
- サイトの使い方
- mysqlの起動が遅いのでなにか良い方法がないか探す
- テストをどうするか


## 本番環境にデプロイ
### 環境変数の設定
.envの"DEV_OR_PRO"を"PRO"にする

### Reactのbuild
- frontendコンテナ内でreactをbuild
`npm run build`
- 作成されたbuildディレクトリを./api/src/に配置
`docker container cp valomemo_frontend:/usr/frontend/build ./api/src`
- localhost:8080/でアクセス可能に

### ImgurAPIのセットアップ
- access_tokenとrefresh_tokenの発行
1. (https://api.imgur.com/oauth2/authorize?client_id=<client_id>&response_type=token&state=hoge)
にアクセス(<client_id>をおきかえて)
2. chromeでF12→Network
3. webページのallowを押す
4. response headersのlocationにaccess_tokenとrefresh_tokenがある

- docker compose downするときにdbのバックアップ(自動化したい)
1. dbコンテナでmysqldumpを実行
`mysqldump -uroot -p<password> valomemo_db > ./docker-entrypoint-initdb.d/pro.sql`
2. ホスト側にコピー
`docker container cp valomemo_db:/docker-entrypoint-initdb.d/pro.sql ./db/docker-entrypoint-initdb.d/`
3. もしバックアップを取らなかったらaccess_tokenとrefresh_tokenを発行する。


### AWSへのデプロイ
1. ビルド
2. imageにタグ付け、ECRにpush
3. context変更
4. docker compose up


ECS上でコンテナ間通信時に名前解決ができない

対処法
- エラーが出ない状態(db接続をしない状態)でデプロイ、入力に応じてdb接続テストできるようにする
- webで調べる
- docker compose convertでcloudFormationを作成。ここから設定を見る
- host名をvalomemo-db, 127.0.0.1, localhostで実行して、ログを比べる
- コンテナを別々にデプロイして接続設定を行う(docker composeを使わない)