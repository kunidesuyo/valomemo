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