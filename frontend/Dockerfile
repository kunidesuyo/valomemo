From node:19.3.0-alpine

WORKDIR /usr/frontend
COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY ./public ./public
EXPOSE 3000
CMD ["npm", "run", "dev"]