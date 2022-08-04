## Importing a component
Importing a component is as simple as just adding the `import` attibute to the element, Fresh will try load the component from the default path unless specified otherwise
```html
<nav import></nav>
```

## Importing a component from a subdirectory
You would usually want to organize your components in different subfolders. If your component is in the `./fresh/components/foo/bar` directory for example, you can simply specify the path relative to the default `components` folder like this:
```html
<nav import="foo/bar"></nav>
```