# Contributing

## Local Development

To modify Angular configuration for your local environment, copy `src/environments/environment.local.example.ts` to `src/environments/environment.local.ts` and update the variables as needed. This is particulary usefull for `environment.server`, to match your local gargantua server URL.

This web application needs gargantua to be running, look at [gargantua](https://github.com/hobbyfarm/gargantua/CONTRIBUTING.md) for more information. The default authentification is admin/admin.

### via Angular server

```bash
npm install
npm run start:local
```

The Angular server will start a watch loop and listen on [localhost:4200](http://localhost:4200).

### via docker-compose

```bash
# start the stack
./compose-up.sh

# -- or --
# start the stack, building changes to local dev container
# only needed if a file in ./cicd/docker-local has changed
./compose-up.sh --build
```

`./compose-up.sh` does the following:

- calls `docker-compose up`
  - creates or starts the `hf-admin-ui` container, runs `npm install` and starts the Angular Server, re-builds on change, and listens on [localhost:16205](http://localhost:16205)

If `packages.json` has changed, stop and restart the `docker-compose` stack so that `npm install` runs inside the Docker container again

To modify `docker-compose` variables for your local environment, copy `.env.example` to `.env` and update variables as needed.
