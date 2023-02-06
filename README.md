# DB
## DBの更新作業
- カラムをいじる場合(追加、変更、削除)
  - './common_info/common_info.json'を変更
  - './db/docker-entrypoint-initdb.d'のsqlファイルを変更
    - (要検証)データが多い場合、composeで立ち上げてdbを直接操作。mysqldumpでできたsqlファイルを用いる。
  - フロントの表示変更

## アカウント管理
- ログイン時にJWTを発行してcookieに保存する。(有効期限は1h)
- localStorageにて"isLogin"を"true"(boolean型ではなく文字列なので注意)にする

- 画面へのアクセスの際localStorageの"isLogin"をみてアクセス制御。
  - trueの場合はそのまま表示。
    - JWTが有効の場合はapiと通信できる。
    - JWTが無効の場合はlogin画面に誘導(未実装)
  - falseの場合はlogin画面へ遷移

- ログアウト時にcookieを削除
- localStorageの"isLogin"を"false"にする。
- api側でJWTを無効化(未実装)


# TODO
- mysqlの起動が遅いのでなにか良い方法がないか探す
- テストをどうするか

- cardのbackdrop

- secretkeyを.envで設定
- setup_listにcreated_byカラム追加
- registerの制限


- dbデータ永続化

- 本番環境にデプロイ

- 余計なファイルを消す
- readme.mdを作成(人に見せられるもの)
- コードのリファクタリング
- search画面
- mylist機能
- サイトの使い方

- 軽タスク
  - imgタグのsrcSetとは？
