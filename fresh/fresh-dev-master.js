let config;
let importedComponentTags = [];
let importedComponentData = [];
let firstload = false;


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
    let imported = 0;

    imports.forEach(component => {

        useComponent(component)
        imported++;

        if (imports.length === imported) {
            // this is known to not work correctly
            window.dispatchEvent(routeLoaded);
            
            if (!firstload) {
                firstload = true;
                window.dispatchEvent(firstLoad);
            }

        }

    });
}

// a call telling Fresh that a component is being used
function useComponent(component) {
    const optionalPath = component.getAttribute("import");

    let componentName = component.tagName.toString().toLowerCase();

    if (!importedComponentTags.includes(component.tagName.toLowerCase())) {

        const imp = async function() {
            const data = await importComponent(componentName, optionalPath);
            renderComponent(component, data)
        }
        imp()

    } else {
    //    console.log(`${component.tagName.toLowerCase()} was already imported, reading from TPM`);
        const componentIndex = importedComponentTags.indexOf(component.tagName.toLowerCase())
        renderComponent(component, importedComponentData[componentIndex])
    }

}

async function importComponent(componentName, optionalPath) {

    let componentPath;


    if (!componentName.endsWith(".fresh")) {
        componentName = componentName + ".fresh"
    }

    if (!optionalPath) {
        componentPath = createPath([config.fresh.root, config.fresh.components, componentName]);
    } else {
        componentPath = createPath([config.fresh.root, config.fresh.components, optionalPath, componentName]);
    }

    let componentData = await fetch(componentPath);
    let data = await componentData.text();
    componentData = data;

    importedComponentTags.push(componentName.toString().replace(".fresh", ""))
    importedComponentData.push(componentData.toString())

    return componentData
}

function renderComponent(where, data) {
    where.outerHTML = data
}


// Fresh router

let TPMRouteNames = [];
let TPMRouteData = [];

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

        window.dispatchEvent(routing);

        if (!config.fresh.router.storeRoutesInTPM) {

            let routeData = await fetch(route);
            let data = await routeData.text();
            routeData = data;

            if (render) {
                renderRoute(routeData)
                getImports()
                window.dispatchEvent(routed);
            }
        } else {

            if (!TPMRouteNames.includes(route.toLowerCase())) {

                try {
                    let routeData = await fetch(route);

                    if (routeData.ok) {
                        let data = await routeData.text();
                        routeData = data;       
                        
                        const parsedData = parseRouteData(routeData)
        
                        TPMRouteNames.push(route)
                        TPMRouteData.push(parsedData)
        
                        renderRoute(parsedData)
                        getImports()
                        window.dispatchEvent(routed);
                    } else {

                        // check whether the app is handling 404 as a route or a static .html file
                        if (config.fresh.router.errorRoute) {
                            let routeData = await fetch(createPath([routesPath, "404.fresh"]));
                            let data = await routeData.text();
                            routeData = data;       
                            
                            const parsedData = parseRouteData(routeData)
            
                            TPMRouteNames.push(route)
                            TPMRouteData.push(parsedData)
            
                            renderRoute(parsedData)
                            getImports()
                            window.dispatchEvent(routed);    

                        } else {
                            window.location = "404.html"
                        }

                    }

                } catch (error) {
                    console.log(error);
                }


            } else {                
                const routeIndex = TPMRouteNames.indexOf(route.toLowerCase())
                renderRoute(TPMRouteData[routeIndex])
                getImports()
                window.dispatchEvent(routed);
            }
        }

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


function parseRouteData(routeData) {
    return routeData
}

// custom router events
const routing = new Event('routing');
const routed = new Event('routed');
const routeLoaded = new Event('routeLoaded');
const firstLoad = new Event('firstLoad');


function createPath(params) {
    try {
        return params.join("/")
    } catch (error) {
        console.log(`path creation failed`);
    }
}


// initalize app
fetchConfig()
