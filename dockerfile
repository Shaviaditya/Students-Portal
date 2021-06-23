FROM node:10

ENV TZ="Asia/Kolkata"
RUN date

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

