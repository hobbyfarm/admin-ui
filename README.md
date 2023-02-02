# Hobbyfarm Admin

This is the admin web UI for [HobbyFarm](https://github.com/hobbyfarm). This is a Single Page Application (SPA) developped with Angular.

## Configuration

A file placed at `/config.json` will allow for runtime configuration (e.g., custom logos, themes, etc.).

```json
{
    "title": "HobbyFarm Administration",
    "favicon": "/assets/default/favicon.png",
    "login": {
        "logo": "/assets/default/rancher-labs-stacked-color.svg",
        "background": "/assets/default/vault.jpg"
    },
    "logo": "/assets/default/logo.svg"
}
```

To customize logos, mount them into the container at `/usr/share/nginx/html/assets`, and then reference the file names in `config.json`. Alternatively, you can reference files from an object store.

## Contributing

### Local Development

To modify Angular configuration for your local environment, copy `src/environments/environment.local.example.ts` to `src/environments/environment.local.ts` and update the variables as needed. This is particulary usefull for `environment.server`, to match your local gargantua server URL.

This web application needs gargantua to be running, look at [gargantua](https://github.com/hobbyfarm/gargantua/CONTRIBUTING.md) for more information. The default authentification is admin/admin.

Execute from a terminal:

```bash
npm install
npm run start:local
```

The Angular server will start a watch loop and listen on [localhost:4200](http://localhost:4200).
