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
- 本番環境にデプロイ
  - 開発環境と本番環境で変わること
    - package.json?
    - docker compose.yml
  - imgurは本番環境用のアカウントを作る
    - apiを使えるようにする手順を書く
  - AWS?GCP?
    - 知りたいこと
      - docker composeをそのまま使えるか
      - 維持費


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



