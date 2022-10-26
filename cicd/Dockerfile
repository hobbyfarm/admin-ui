# Should only be used with GitHub Actions cicd
# For local, refer to Dockerfile at root of project
FROM nginx:stable-alpine

COPY ./dist/* /usr/share/nginx/html

# copy staged files
COPY cicd/stage-release/ /

ENTRYPOINT ["entrypoint.sh"]
