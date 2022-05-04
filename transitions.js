function transitions() {
    const progressbar = document.querySelector("loader")

    window.addEventListener('routing', function (e) {
        progressbar.classList.remove("loaded")
        progressbar.classList.add("loading")
    }, false);

    window.addEventListener('routed', function (e) {
        progressbar.classList.remove("loading")
        progressbar.classList.add("loaded")
    }, false);
}

window.addEventListener('routeLoaded', function (e) {
    transitions()
}, false)

