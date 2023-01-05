#作成時のlatestバージョンのalpine
From node:19.3.0-alpine
# コードを置くディレクトリに移動
# 移動しないとnpm install でエラーになる
WORKDIR /usr/app
# RUN npm init
# package.jsをどうする？
RUN npm install express
COPY ./app.js ./
EXPOSE 80
CMD ["node", "app.js"]