# 🧊 Fresh
A fresh approach to creating single page apps

----

**Fresh** is a javascript framework built with developers in mind. It forges concepts of many existing frameworks, builds on them and introduces new features to the table.

Fresh is designed as an easy to use and grasp framework, that you can learn in minutes. It's currently focused on `SPA`s but this might change in the future.

⚠ **Fresh is a personal side-project. It's heavily work-in-progress and lots of features are still not implemented, or not working correctly. It's NOT suitable for production yet.** ⚠

----

<p align="center"> Table of contents </p>

[Main concepts](#Main_concepts) 


----

## Main concepts

### Not opinionated, but standardized
Fresh doesn't tell you how to organize your project, but rather guides you to a standard by using defaults that you shouldn't ever need to change. However, if you ever need to, nothing will break and you will be able to develop without any hiccups, Fresh is a framework focused on the developer.

### Config
Every Fresh app needs a `fresh.config.json` to run. Here's a basic config file:
```json
{
    "fresh": {
        "root": "fresh",
        "components": "components",

        "storeRoutesInTPM": true,
        
        "router": {
            "entryPoint": "app",
            "routes": "routes"
        }
    }
}
```
What does all of this mean?
`root` - the root folder Fresh resides in
`components` - you store your components in this directory
`storeRoutesInTPM` - head to [TPM](#TPM) for a brief explanation
`entryPoint` - the element your routes get injected in, it's basically where your webapp lives
`routes` - you store your routes (pages) in this directory

### Components
You declare your components in files ending with the `.fresh` extension, in the `components` directory specified in the config.

On default it's `./fresh/components`

#### Example component
An example `nav` component from `components` directory, it's just valid `html` markup so you don't need to learn a new language
```html
<nav>
    <a href="/#/"> Main page </a>
    <a href="/#/route"> Route </a>
</nav>
```

#### Importing a component
Importing a component is as simple as just adding the `import` attibute to the element, Fresh will try load the component from the default path unless specified otherwise
```html
<nav import></nav>
```

##### Importing a component from a subdirectory
You would usually want to organize your components in different subfolders. If your component is in the `./fresh/components/foo/bar` directory for example, you can simply specify the path relative to the default `components` folder like this:
```html
<nav import="foo/bar"></nav>
```

#### Fallback
When a component fails to load, your users won't get an easy to understand error message on the screen, so you must ensure that the most crucial components on your page provide at least a hint that something went wrong

While it should be almost impossible for a component to not load correctly, there are still the edge cases you need to be prepared for.

Here's an example of the `nav` component with a fallback
```html
<nav import> The website navigation failed to load </nav>
```

Even though a `<noscript>` tag informing the user about disabled javascript should be enough, adding a fallback message is still a good practice.

### Routing
Fresh comes with a router that automatically fetches the correct route and loads it when it's requested.
You link between routes by appending `/#/` at the beggining of a route, so Fresh knows when to reroute.

An example of linking to another page called `route`:
```html
<a href="/#/route"> A link </a>
```

### TPM
Tpm - standing for **Temporary Memory** is easiest to understand by just comparing it to cache, with the difference of it immediately clearing after realoding the page.

All your components and routes (`storeRoutesInTPM` in the config) are stored in TPM and loaded when needed, minimizing the amount of requests sent to the server and making the app faster by storing already used data client-side.
