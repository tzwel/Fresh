window.addEventListener('routing', function (e) {
    document.body.classList.remove("loaded")
    document.body.classList.add("loading")
}, false);

window.addEventListener('routed', function (e) {
    document.body.classList.remove("loading")
    document.body.classList.add("loaded")
}, false);