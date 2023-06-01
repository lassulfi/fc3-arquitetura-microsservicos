FROM node:19.7-alpine3.17

WORKDIR /srv/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["node", "./dist/index.js"]
