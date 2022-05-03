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
    router()
    getImports()
}

// get all elements with the import tag
function getImports() {
    const imports = document.querySelectorAll("*[import]")

    imports.forEach(component => {

        if (!importedComponentTags.includes(component.tagName.toLowerCase())) {

            const replaceouterHTML = async function() {
                component.outerHTML = await fetchComponentData(component)
            }

            replaceouterHTML()

        } else {

            console.log(`${component.tagName.toLowerCase()} was already imported, caching will be supported in the future`);

            /* temporary solution */
            const replaceouterHTML = async function() {
                component.outerHTML = await fetchComponentData(component)
            }
            replaceouterHTML()
            /* temporary solution */



            /*
        const replaceCachedouterHTML = async function() {

            console.log(`${component.tagName.toLowerCase()} already imported`);
            const componentIndex = importedComponentTags.indexOf(component.tagName.toLowerCase())
            component.outerHTML = await importedComponentData[componentIndex]  
            console.log(importedComponentData[1]);  
        }
         //   replaceCachedouterHTML()

            console.log(importedComponentData[0]);  

            */
        }
        






    });

}

// get text data of components
async function fetchComponentData(component) {
 
    let componentName = component.tagName.toString().toLowerCase();

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









// Fresh router
function router() {
    const routesPath = createPath([config.fresh.root ,config.fresh.router.routes])
    let entryPoint = document.querySelector(config.fresh.router.entryPoint);
  //  const routePath = createPath([routesPath, entryPoint.tagName.toLowerCase()]);

    async function fetchRoute(route, render) {
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
        entryPoint.innerHTML = ""
        entryPoint.insertAdjacentHTML("afterbegin", data)    
    }

    // Fetch and render the index.fresh route
    fetchRoute(createPath([routesPath, "index.fresh"]), true)


    

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




