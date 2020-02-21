ARG GIT_COMMIT_SHORT_HASH
FROM hobbyfarm/ui-sdk:${GIT_COMMIT_SHORT_HASH} AS sdk

RUN $(npm bin)/ng build --prod --aot


FROM nginx:stable-alpine

COPY --from=sdk /app/dist/* /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
