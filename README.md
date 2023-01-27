# TODO
- mysqlの起動が遅いのでなにか良い方法がないか探す
- テストをどうするか
- アカウント機能を実装

- 全体的に見た目を整える。
  - create画面
  - read画面
  - update画面(createとほぼ同じ)
- dbデータ永続化
- ログイン機能をつける。

- db int 未定義でも入れれるようにする

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