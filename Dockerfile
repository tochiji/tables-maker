FROM node:10
WORKDIR /Users/Yosi/Desktop/github/tables-maker
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV PORT 80
EXPOSE 80
CMD [ "node", "server.js" ]