# valomemo
本番環境にデプロイしたアプリは[こちら](https://valomemo.onrender.com/)からアクセスできる。register画面からアカウント登録すれば利用可能。  
30分アクセスがないとサーバーがスリープしてしまうのでアクセスに時間がかかる場合がある。
## 作られた目的
VALORANTというゲームのセットアップ(後述)をメモするために作られた。  
VALORANTは5vs5のFPSゲーム。21人のエージェントが存在し、それぞれ固有のアビリティを4つ所持している。アビリティの挙動にランダム性はなく、同じ場所で同じ使い方をすれば全く同じ効果が得られる。そのため、9つあるマップごとに各アビリティの非常に強力な効果を得られる使用方法が存在し、セットアップと呼ばれている。セットアップを覚えておくのは非常に大変であるため、メモしておくことができる本アプリが開発された。

## 本アプリの機能
- アカウント機能
  - アカウントの登録  
    アカウントの登録ができる。環境変数でアカウント数を制御している。登録したら自動でログインするようにしている。もちろんパスワードはハッシュ化してDBに保存。
  - ログイン  
    登録したユーザーネームとパスワードを照合してログインできる。ログインに成功したらcookieにJWTのtokenをセット。apiを通信するたびに照合。
  - ログアウト機能  
    cookieにあるJWTのtokenを削除

- セットアップのCRUD機能  
セットアップはテキストと画像からなる。値が決まっているもの(map, agent, ability)は選択肢から選ぶようにする。画像はimgur(画像公開サービス)にAPIを利用して保存。
  - Create  
    画像以外はそのままdbに保存。画像はimgurにapiを使ってアップロードし、dbにはアップロードした画像のURLを保存。
  - Read  
    保存したセットアップをdbから読み取り表示する。一目でどのようなセットアップか分かるように最低限の情報を表示し、クリックすると詳細が表示されるようにした。
    検索機能も実装。
  - Update  
    画像以外は内容を更新できるようにした。画像に関してはImgurのapiにupdate機能がないため実装しなかった。(delete,createで実装してもいいかも)
  - Delete  
    dbから対象のレコードを削除。画像もapiを使ってアップロードした画像を削除。


## 開発環境のシステム構成
![](dev_env.drawio.svg)  
開発環境はdockerを用いた。各コンテナのDockerfileを作成し、dockercomposeでまとめて立ち上げる。dbコンテナの立ち上がりが遅いのでヘルスチェクで起動確認してからapiコンテナを立ち上げるようにした。

### frontend
ReactとMaterial-UIを使用。axiosを用いてapiコンテナと通信。  
ソースコードをbindして、更新を検知してホットリロードする。
### backend(api)
node.jsのexpressでサーバーを立ち上げる。  
DB操作はsequelizeを使用。もともとsql文を書いていたが、本番環境によってdbのタイプが違う事があったり、マイグレーションを実行したいのでsequelizeを導入。  
ソースコードをbindして、更新を検知してホットリロード(nodemon)する。
### DB
開発環境はMySQL、本番環境はPostgreSQL。

## 本番環境のシステム構成
![](pro_env.drawio.svg)  
frontendのソースコードをbuildしてhtml,jsファイルに変換し、apiフォルダの中に配置。特定のURLにアクセスされたらbrowserに返すようにする。  
本番環境(render.com)にはapiフォルダのDockerfileを用いてweb serviceをデプロイ。またdb serviceも立ち上げた。環境変数でdbサービスへの接続情報などを制御。

## 作成に使用した教材
- progate
  - Node.jsコース
  - Reactコース
  - JavaScriptコース
  - SQLコース
  - HTML&CSSコース

- 書籍
  - asakohattori. 基礎から学ぶ React/React Hooks. シーアンドアール研究所. 2021
  - 伊藤 裕一. たった1日で基本が身に付く！ Docker/Kubernetes超入門. 技術評論社. 2020

## (開発者用)ローカルで環境を再現する
(編集中)(ファイル分けようかな)
大まかなながれ
1. git clone
2. .envを作成
3. imgurアカウント作成、token取得、配置
4. docker compose

# TODO(実装予定)
- 各画面にアクセスした際にログイン状態をbackendに通信して確認するように変更する
- mypage作成
  - 投稿したセットアップの表示
  - 作成したmylistの表示
- mylist機能
- not found画面作る
- docker compose downするときにdbのバックアップを作成するようにする
  - docker compose down し忘れたとき(バックアップがされなかったとき)の復元
    - apiのtoken系は再発行手順を書いておく
- (setupcardコンポーネント)ユーザー名が一致しないセットアップでは編集、削除ボタンを表示しないようにする
- apiのレスポンスを整える(messageに内容を入れ、frontendでその内容を表示するようにする)
- コードのリファクタリング
  - createUpdateでpostDataとupdateDataをまとめる
- cardのbackdropで高さをレスポンシブに対応
- mypage機能
  - 投稿したセットアップの表示
  - 作成したmylistの表示
- mylist機能
- サイトの使い方
- テストをどうするか
