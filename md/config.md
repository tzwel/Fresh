# Config

Every Fresh app needs a `config` to run. Here's a basic config placed directly in `index.html` as a `<script>` tag:
```html
<script>
    const Fresh = {
        "fresh": {
            "root": "fresh",
            "components": "components",

            "router": {
                "storeRoutesInTPM": true,
                "errorRoute": true,
                "entryPoint": "app",
                "routes": "routes"
            }
        }
    };
</script>
```

A config can also be a json file. An example `fresh.config.json` file:
```json
{
    "fresh": {
        "root": "fresh",
        "components": "components",
        
        "router": {
            "storeRoutesInTPM": true,
            "errorRoute": true,
            "entryPoint": "app",
            "routes": "routes"
        }
    }
}
```

## What does all of this mean?

`root` - the root folder Fresh resides in

`components` - you store your components in this directory

`storeRoutesInTPM` - head to [tpm](tpm.md) for a brief explanation

`errorRoute` - whether to redirect 404 errors to a custom 404.fresh route, or not

`entryPoint` - the element your routes get injected in, it's basically where your webapp lives

`routes` - you store your routes (pages) in this directory