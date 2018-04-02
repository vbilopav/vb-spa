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

        "/module-plain-text": {
            view: "views/modules/module-plain-text",
            data: {
                title: "Plain text from module",
                category: "modules"
            }
        },

        "/module-plain-text-template": {
            view: "views/modules/module-plain-text-template",
            data: {
                title: "Template plain text from module",
                category: "modules"
            }
        },
 
        "/class-module-simple": {
            view: "views/modules/class-module-simple",
            data: {
                title: "Simple text from class module",
                category: "modules"
            },
            paramsMap: (...params) => params
        },
 
        "/class-module-change-element": {
            view: "views/modules/class-module-change-element",
            data: {
                title: "Class module with change method",
                category: "modules"
            },
            paramsMap: (...params) => params
        },
 
        "/class-module-element-manipulation": {
            view: "views/modules/class-module-element-manipulation",
            data: {
                title: "Class module - element manipulation",
                category: "modules"
            },
            paramsMap: (...params) => params
        },     
 
        "/object-module-simple": {
            view: "views/modules/object-module-simple",
            data: {
                title: "Simple text from object module",
                category: "modules"
            },
            paramsMap: (...params) => params
        },   
 
        "/object-module-change-element": {
            view: "views/modules/object-module-change-element",
            data: {
                title: "Object module with change method",
                category: "modules"
            },
            paramsMap: (...params) => params
        },    
 
        "/object-module-element-manipulation": {
            view: "views/modules/object-module-element-manipulation",
            data: {
                title: "Object module - element manipulation",
                category: "modules"
            },
            paramsMap: (...params) => params
        },
 
        "/view-events": {
            view: "views/modules/view-events",
            data: {
                title: "View events",
                category: "modules"                
            },
            paramsMap: (...params) => params
        },    
        
        "/events-handlings": {
            view: "views/modules/events-handlings",
            data: {
                title: "Event handlings",
                category: "modules"                
            }            
        }, 

        "/dependency-injection-template": {
            view: {
                name: "template!views/dynamic-data/di/template.html",
                inject: [
                    "template!views/dynamic-data/di/injected/template.html",
                    "views/dynamic-data/di/injected/custom-module1",
                    "views/dynamic-data/di/injected/custom-module2"
                ] 
            },
            data: {
                title: "Dependency injection - template",
                category: "dynamic"
            }            
        }, 

        "/dependency-injection-object-module": {
            view: {
                name: "views/dynamic-data/di/object-module",
                inject: [
                    "template!views/dynamic-data/di/injected/template.html",
                    "views/dynamic-data/di/injected/custom-module1",
                    "views/dynamic-data/di/injected/custom-module2"
                ]
            },
            data: {
                title: "Dependency injection - object module",
                category: "dynamic"
            }            
        }, 

        "/dependency-injection-class-module": {            
            view: {
                name: "views/dynamic-data/di/class-module",
                inject: [
                    "template!views/dynamic-data/di/injected/template.html",
                    "views/dynamic-data/di/injected/custom-module1",
                    "views/dynamic-data/di/injected/custom-module2"
                ]
            },
            data: {
                title: "Dependency injection - class module",
                category: "dynamic"
            }            
        },

        "/declarative-model-binding": {
            view: "views/dynamic-data/model-binding/declarative",
            data: {
                title: "Model binding - declarative",
                category: "dynamic"
            }            
        }, 

        "/programmatic-model-binding": {
            view: "views/dynamic-data/model-binding/programmatic",
            data: {
                title: "Model binding - programmatic",
                category: "dynamic"
            }            
        }, 

        "/remote-data-example": {
            view: "views/dynamic-data/remote-data-example",
            data: {
                title: "Remote data - master detail example",
                category: "dynamic"
            }            
        }, 

        "/remote-data-example/details": {
            view: "views/dynamic-data/remote-data-details",
            paramsMap: (...params) => {
                if (params.length !== 1) {
                    return false;
                }
                return iparams[0];
            },
        }, 
 
        "/not-found": {
            view: "text!views/not-found.html"
        }
        
    }
});
