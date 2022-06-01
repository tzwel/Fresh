function transitions() {
    const progressbar = document.querySelector("loader")


    window.addEventListener('routing', function (e) {
        console.log("routing");


        progressbar.classList.remove("loaded")
        progressbar.classList.add("loading")
    }, false);

    window.addEventListener('routed', function (e) {
        console.log("routed");

        progressbar.classList.remove("loading")
        progressbar.classList.add("loaded")
    }, false);
}

window.addEventListener('routeLoaded', function (e) {
    
    transitions()
}, false)

