# アプリ概要
本番環境にデプロイしたアプリは[こちら](https://valomemo.onrender.com/)からアクセスできる。30分アクセスがないとスリープしてしまうのでアクセスに時間がかかる場合がある。
## 作られた目的
VALORANTというゲームのセットアップ(後述)をメモするために作られた。  
VALORANTは5vs5のFPSゲーム。21人のエージェント(2022/03/07時点)が存在し、それぞれ固有のアビリティ4つ所持している。アビリティの挙動にランダム性はなく、同じ場所で同じ使い方をすれば全く同じ効果が得られる。そのため、マップ(2022/03/07時点で9つ)ごとに各アビリティの非常に強力な効果を得られる使用方法が存在し、セットアップと言われている。セットアップを覚えるのは非常に大変であるため、セットアップをメモしておくことができる本アプリが開発された。

## 本アプリの機能
- アカウント機能
  - アカウントの登録  
    アカウントの登録ができる。アカウント数を環境変数で制御している。登録したら自動でログインするようにしている。もちろんパスワードはハッシュ化して保存。
  - ログイン  
    登録したユーザーネームとパスワードを照合してログインできる。ログイン制御はJWTを使用。
  - ログアウト機能  
(詳細追加)


- セットアップのCRUD機能  
セットアップはテキストと画像からなる。画像はimgur(画像公開サービス)にAPIを利用して保存
  - Create  
  (詳細追加)
  - Read  
  (詳細追加)
  - Update  
  (詳細追加)
  - Delete  
  (詳細追加)

- 実装予定
  - お気に入り機能
  - セットアップをまとめたマイリスト機能


## システム構成
![](dev_env.drawio.svg)

## frontend
ReactとMaterial-UIを使用。
## backend
node.jsのexpressを使用。DB操作はsequelizeを使用。
## DB
開発環境はMySQL、本番環境はPostgreSQL。
### DBの更新作業(編集する)
- カラムをいじる場合(追加、変更、削除)
  - './common_info/common_info.json'を変更
  - './db/docker-entrypoint-initdb.d'のsqlファイルを変更
    - (要検証)データが多い場合、composeで立ち上げてdbを直接操作。mysqldumpでできたsqlファイルを用いる。
  - フロントの表示変更

## アカウント管理
各画面にアクセスした際にログイン状態をbackendに通信して確認するように変更する

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

# ローカルで環境を再現する
編集中
1. git clone
2. .envを作成
3. imgurアカウント作成、token取得
4. docker compose

# 本番環境にデプロイ

(システム構成図を貼る)
![](pro_env.drawio.svg)

## 環境変数の設定
.envの"DEV_OR_PRO"を"PRO"にする

## Reactのbuild
- frontendコンテナ内でreactをbuild  
`npm run build`
- 作成されたbuildフォルダを./api/src/に配置  
`docker container cp valomemo-frontend:/usr/frontend/build ./api/src`
- 開発環境で動作確認  
localhost:8080/でアクセス可能に

## ImgurAPIのセットアップ
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

## 動作確認
- apiコンテナにbuildしたreactファイルを配置。ルートにアクセスしてそのファイルを返すようにする
- 表示されたwebページからapiコンテナに通信できるか
- apiコンテナからdbに接続できるか

## render.comにデプロイ

### dbに接続
- コマンドラインから接続する
render.comのサイトでDBのページに移動(dashbordから)。  
info->psql commandをコピーして実行(先頭のパスワードは消して、コマンド実行後に入力)

# TODO
- readme.mdを作成(人に見せられるもの)
- 各画面にアクセスした際にログイン状態をbackendに通信して確認するように変更する
- mypage作成
  - 投稿したセットアップの表示
  - 作成したmylistの表示
- mylist機能
- home画面を作る
  - 画像とか入れていい感じにする
- not found画面作る
- docker compose downするときにdbのバックアップを作成するようにする
  - docker compose down し忘れたとき(バックアップがされなかったとき)の復元
    - apiのtoken系は再発行手順を書いておく
- (setupcardコンポーネント)ユーザー名が一致しないセットアップでは編集、削除ボタンを表示しないようにする
- apiのレスポンスを整える(messageに内容を入れ、frontendでその内容を表示するようにする)
- コードのリファクタリング
  - createUpdateでpostDataとupdateDataをまとめる
- cardのbackdropで高さをレスポンシブに対応
- mypage作成
  - 投稿したセットアップの表示
  - 作成したmylistの表示
- mylist機能
- サイトの使い方
- mysqlの起動が遅いのでなにか良い方法がないか探す
- テストをどうするか