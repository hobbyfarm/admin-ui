#!/bin/sh

read -r -d '' CONTENT <<- EOT
import pkg from '../../package.json';

export const environment = {
    production: true,
    server: '$HF_SERVER',
    version: pkg.version
};
EOT

echo -e "$CONTENT" > /data/src/environments/environment.prod.ts

ng serve --aot --prod --port 80 --host 0.0.0.0 --disable-host-check --live-reload=false