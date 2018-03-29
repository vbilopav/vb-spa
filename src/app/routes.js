define([], () => {

    return {
        "/": {
            id: "home",
            view: "text!views/home.html",
            data: {
                title: "Home"
            }
        },
        "/plain-text": {                    
            view: "text!views/templates/plain-text-view.html",
            data: {
                title: "Plain text view",
                category: "templates"
            }
        },     
        "/keep-state": {                    
            view: "text!views/templates/state-view.html",
            data: {
                title: "Plain text view - state handling",
                category: "templates"
            }
        }, 
        "/parameterized": {
            view: "template!views/templates/parameterized.html", 
            paramsMap: (...params) => {
                if (params.length > 3) {
                    return false;
                }                        
                return {
                    first: params[0],
                    second: Number(params[1]),
                    third: params[2] ? params[2].split(",") : []
                };
            },
            data: {                        
                title: "Parameterized",
                category: "templates"
            }
        },
        "/parameterized/sub-route": {
            view: "template!views/templates/parameterized-sub-route.html", 
            paramsMap: (...params) => {
                if (params.length > 1) {
                    return false;
                }                        
                return {
                    firstAndOnly: params[0]                            
                };
            },
            data: {                        
                title: "Parameterized sub route",
                category: "templates"
            }
        },
        "/composite": {
            view: "template!views/templates/composite/template1.html", 
            data: {
                title: "Composite template",
                category: "templates"
            },
            paramsMap: (...params) => params
        },
        "/module-simple-text": {
            view: "views/modules/simple-text",
            data: {
                title: "Simple text from module",
                category: "modules"
            }
        },
        "/module-class-simple-text": {
            view: "views/modules/class-module-text",
            data: {
                title: "Simple text from class module",
                category: "modules"
            },
            paramsMap: (...params) => params
        },
        "/not-found": {
            view: "text!views/not-found.html"
        },
    }
});
