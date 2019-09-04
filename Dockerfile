FROM alexsuch/angular-cli:7.3.8

COPY entrypoint.sh /data/entrypoint.sh
COPY src/ /data/src/
COPY *.json /data/

WORKDIR /data

RUN npm install

RUN chmod +x /data/entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "/data/entrypoint.sh" ]