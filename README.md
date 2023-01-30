# TODO
- mysqlの起動が遅いのでなにか良い方法がないか探す
- テストをどうするか
- アカウント機能を実装

- ログイン機能をつける。
  - ログアウト機能をつける。
    - とりあえずブラウザのクッキーを削除
  - secretkeyを.envで設定
  - setup_listにcreated_byカラム追加


- dbデータ永続化

- readme.mdを作成(人に見せられるもの)
- コードのリファクタリング
- search画面
- mylist機能
- サイトの使い方


# DB
## DBの更新作業
- カラムをいじる場合(追加、変更、削除)
  - './common_info/common_info.json'を変更
  - './db/docker-entrypoint-initdb.d'のsqlファイルを変更
    - (要検証)データが多い場合、composeで立ち上げてdbを直接操作。mysqldumpでできたsqlファイルを用いる。
  - フロントの表示変更

## ログイン管理
- ログインまたはアカウント登録じにJWTを発行してcookieに保存する。通信に保存したtokenを付与してアクセス制限する。