# Fallbacks
When a component fails to load, your users won't get an easy to understand error message on the screen, so you must ensure that the most crucial components on your page provide at least a hint that something went wrong

While it should be almost impossible for a component to not load correctly, there are still the edge cases you need to be prepared for.

Here's an example of the `nav` component with a fallback
```html
<nav import> The website navigation failed to load </nav>
```

Even though a `<noscript>` tag informing the user about disabled javascript should be enough, adding a fallback message is still a good practice.