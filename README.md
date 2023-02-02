# Hobbyfarm Admin

This is the admin UI for [HobbyFarm](https://github.com/hobbyfarm)

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

If you're interested in contributing, see [CONTRIBUTING.md](CONTRIBUTING.md)
