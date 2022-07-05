let config;
let importedComponentTags = [];
let importedComponentData = [];
let firstload = false;
let renderedComponents = 0;
const scriptRegex = /<script>([\s\S]*?)<\/script>/
const variableInitRegex = /(?<="init ).+?(?=")/g;

function $qsa(p) {
    return document.querySelectorAll(p)
}
function $qs(p) {
    return document.querySelector(p)
}

// Get the config from "./fresh.config.json" on app start
async function getConfig() {

    if (typeof Fresh === 'undefined') {

        // if config not declared in index

        let getconfig = await fetch("./fresh.config.json");
        let parsed = await getconfig.json();
        config = parsed;
    
        console.log(config);
    } else {
        config = Fresh
    }

    initialize()
}

function initialize() {
    checkHash()
}

// get all elements with the import tag
async function getImports() {
    const imports = document.querySelectorAll("*[import]")
    let imported = 0;
    renderedComponents = 0;

    imports.forEach(component => {

        useComponent(component)
        imported++;

        if (imports.length === renderedComponents) {
            // console.log("debug");
        }

        if (imports.length === imported) {
            // this is known to not work correctly
            window.dispatchEvent(routscriptMatchesaded);
            
            if (!firstload) {
                firstload = true;
                window.dispatchEvent(firstLoad);
            }

        }

    });
}

// a call telling Fresh that a component is being used
async function useComponent(component) {
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
    renderedComponents++
    where.outerHTML = data
}


// Fresh router

let TPMRouteNames = [];
let TPMRouteData = [];

function router(route, render) {
    const routesPath = createPath([config.fresh.root, config.fresh.router.routes])
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
                    
                        handleScripts(parsedData)

                        window.dispatchEvent(firstRouteLoad); 


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

                            handleScripts(parsedData)

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
                handleScripts(TPMRouteData[routeIndex])
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

function handleScripts(routeData) {
    // only supports staying in tpm
    // look for <script> tags
    const scriptMatches = routeData.match(scriptRegex)
    if (!scriptMatches || scriptMatches.length <= 1) {
        // console.log("no script tag");
    } else if (scriptMatches && scriptMatches.length <= 2)  {

      //  console.log(scriptMatches[1]);


      scriptMatches[1] =  scriptMatches[1].replace(/\$var/g, 'window')


        // this may not work as expected
        const variableInitMatches = scriptMatches[1].match(variableInitRegex)
       // console.log(variableInitMatches);


        if (variableInitMatches) {
            variableInitMatches.forEach(variable => {

                if (window[variable] === undefined) {
                    const createvar = Function(`return window.${variable} = 0;`)
                    createvar()
                    //console.log("Xd");
                } else {
                    console.log("variable exists");
                }
    
            });      
        }



            // exec code TODO
        const evaluated = Function(`${scriptMatches[1]}`)
        evaluated()

    } else {
        console.log("A route can have only 1 script tag");
    }
}

// custom router events
const routing = new Event('routing');
const routed = new Event('routed');
const routscriptMatchesaded = new Event('routscriptMatchesaded');
const firstLoad = new Event('firstLoad');
const firstRouteLoad = new Event('firstRouteLoad');


function createPath(params) {
    try {
        return params.join("/")
    } catch (error) {
        console.log(`path creation failed`);
    }
}


// initalize app
getConfig()
