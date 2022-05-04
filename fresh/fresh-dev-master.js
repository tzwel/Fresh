let config;
let importedComponentTags = [];
let importedComponentData = [];

// Get the config from "./fresh.config.json" on app start
async function fetchConfig() {
    let getconfig = await fetch("./fresh.config.json");
    let parsed = await getconfig.json();
    config = parsed;

    initalize()
}

function initalize() {
    checkHash()
    getImports()
}

// get all elements with the import tag
function getImports() {
    const imports = document.querySelectorAll("*[import]")

    imports.forEach(component => {

        useComponent(component)


    });

}

// a call telling Fresh that a component is being used
function useComponent(component) {
    let componentName = component.tagName.toString().toLowerCase();

    if (!importedComponentTags.includes(component.tagName.toLowerCase())) {

        const imp = async function() {
            const data = await importComponent(componentName)
            renderComponent(component, data)
        }
        imp()

    } else {
        console.log(`${component.tagName.toLowerCase()} was already imported, reading from tpm`);
        const componentIndex = importedComponentTags.indexOf(component.tagName.toLowerCase())
        renderComponent(component, importedComponentData[componentIndex])
    }

}

async function importComponent(componentName) {

    importedComponentTags.push(componentName.toString())

    if (!componentName.endsWith(".fresh")) {
        componentName = componentName + ".fresh"
    }

    const componentPath = createPath([config.fresh.root, config.fresh.components, componentName]);

    let componentData = await fetch(componentPath);
    let data = await componentData.text();
    componentData = data;

    importedComponentData.push(componentData.toString())

    return componentData
}

function renderComponent(where, data) {
    where.outerHTML = data
}


// Fresh router
function router(route, render) {
    const routesPath = createPath([config.fresh.root ,config.fresh.router.routes])
    let entryPoint = document.querySelector(config.fresh.router.entryPoint);

    async function fetchRoute(route, render) {

        if (!route.endsWith(".fresh")) {
            route = route + ".fresh"
        }

        if (route === ".fresh" || route === createPath([routesPath, ".fresh"])) {
            route = routesPath + "/index.fresh"
        }

        let routeData = await fetch(route);
        let data = await routeData.text();
        routeData = data;

        if (render) {
            renderRoute(routeData)
        }
        
        getImports()
        return routeData;
    }

    function renderRoute(data) {
        entryPoint.innerHTML = data
    }

    fetchRoute(route, render)

}

window.onhashchange = () => {

    checkHash()

}

function checkHash() {
    if (!window.location.hash || window.location.hash === "") {
        router(createPath([config.fresh.root, config.fresh.router.routes, "index"]), true)
    } else {
        router(createPath([config.fresh.root, config.fresh.router.routes, window.location.hash.replace("#/", "")]), true)
    }
}




function createPath(params) {
    try {
        return params.join("/")
    } catch (error) {
        console.log(`path creation failed`);
    }
}


// initalize app
fetchConfig()
