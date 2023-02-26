#作成時のlatestバージョンのalpine
FROM node:19.3.0-alpine
# コードを置くディレクトリに移動
# 移動しないとnpm install でエラーになる
WORKDIR /usr/api
COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY ./common_info ./common_info
EXPOSE 8080
CMD ["npm", "run", "start"]