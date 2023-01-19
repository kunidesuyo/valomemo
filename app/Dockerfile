#作成時のlatestバージョンのalpine
From node:19.3.0-alpine
# コードを置くディレクトリに移動
# 移動しないとnpm install でエラーになる
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY ./src ./src
EXPOSE 8080
CMD ["npm", "run", "start"]