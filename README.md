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
    - JWTが無効の場合はlogin画面に誘導
  - falseの場合はlogin画面へ遷移

- ログアウト時にcookieを削除
- localStorageの"isLogin"を"false"にする。
- api側でJWTを無効化(未実装)


# TODO

- localStorageで管理しているログイン状態をstateで管理するように変更してみる。
  - ログイン状態はbooleanではなくユーザー名にする

- setup_listにcreated_byカラム追加
  - api
    - create作成時にcreated_byに書き込むように変更
    - readでcreated_byも読み込むようにする。
    - updateでユーザー名が一致しなかったら弾く
    - deleteでユーザー名が一致しなかったら弾く
  - frontend
    - read画面
      - created_byを受け取る
      - ユーザー名が一致しないセットアップでは編集、削除ボタンを表示しないようにする
    - create画面(ユーザー名はapi側でやるので特に編集する必要なし？)
    - update画面　ユーザー名が一致しない場合は弾く(read画面に遷移)
    - delete機能　ユーザー名が一致しない場合は弾く(read画面に遷移)


- dbデータ永続化
  - dbデータを定期的にバックアップ(cron)
  - バックアップしたらgcsにアップロード
- 本番環境にデプロイ
  - imgurは本番環境用のアカウントを作る
    - apiを使えるようにする手順を書く
  - AWS?GCP?
    - 知りたいこと
      - docker composeをそのまま使えるか
      - 維持費


- mysqlの起動が遅いのでなにか良い方法がないか探す
- テストをどうするか
- readme.mdを作成(人に見せられるもの)
- コードのリファクタリング
- cardのbackdropで高さをレスポンシブに対応
- mypage作成
  - 投稿したセットアップの表示
  - 作成したmylistの表示
- search画面
- mylist機能
- サイトの使い方

