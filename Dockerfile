FROM node:10.15.0

RUN mkdir /usr/src/mafio
WORKDIR /usr/src/mafio

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

USER node
CMD ["node", "index.js"]
