# 🧊 Fresh
A fresh approach to creating single page apps

----

**Fresh** is a javascript framework built with developers in mind. It forges concepts of many existing frameworks, builds on them and introduces new features to the table.

Fresh is designed as a easy to use and grasp framework, that you can learn in minutes. It's currently focused on `SPA`s but this might change in the future.

## Main concepts

### Not opinionated, but standardized
Fresh doesn't tell you how to organize your project, but guides you to a standard by using defaults that you shouldn't ever need to change. However, if you ever need to, nothing will break and you will be able to develop without any hiccups, Fresh is a framework focused on the developer.

### Components
You declare your components in files ending with the `.fresh` extension, in the `components` directory specified in the config.

On default it's `./fresh/components`

#### Example component
An example `nav` component from `components` directory, it's just valid `html` markup so you don't need to learn another language
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

### TPM
Tpm - standing for **Temporary Memory** is easiest to understand by just comparing it to cache, with the difference of it immediately clearing after realoding the page.

All your components, and optionally routes (`storeRoutesInTPM` in the config) are stored in TPM, and loaded when needed, minimizing the amount of requests sent to the server and making the app faster by storing already used data client-side.
