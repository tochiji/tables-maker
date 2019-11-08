FROM node:10
WORKDIR /Users/hj1251/Desktop/github/tables-maker
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV PORT 80
EXPOSE 80
CMD [ "node", "server.js" ]