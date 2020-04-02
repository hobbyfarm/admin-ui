##### sdk image #####
FROM node:lts-alpine AS sdk

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:prod


###### release image #####
FROM nginx:stable-alpine

COPY --from=sdk /app/dist/* /usr/share/nginx/html

# copy staged files
COPY cicd/docker/stage-release/ /

# Install bash
RUN apk --no-cache add bash

ENTRYPOINT ["entrypoint.sh"]
