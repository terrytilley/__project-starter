FROM node:13.2.0-alpine
LABEL maintainer="Terry Tilley <terry@terrytilley.com>"

WORKDIR /usr/app

COPY . .

RUN npm install -g yarn
RUN yarn install
RUN yarn run build

COPY .env ./dist/

EXPOSE 4000
CMD node dist/index.js