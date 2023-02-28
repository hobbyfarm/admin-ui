##### sdk image #####
FROM node:lts-alpine3.16 AS sdk

RUN apk add python3 make g++

WORKDIR /app

COPY package*.json ./

ARG NODE_OPTIONS=--openssl-legacy-provider
RUN npm install

COPY . .
RUN npm run build:prod

###### release image #####
FROM nginx:stable-alpine

COPY --from=sdk /app/dist/* /usr/share/nginx/html

# copy staged files
COPY .docker/stage-release/ /

ENTRYPOINT ["entrypoint.sh"]
