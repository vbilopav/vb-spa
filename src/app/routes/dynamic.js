define([], () => {

    return {

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

        "/declarative-binding-simple": {
            view: "views/dynamic-data/model-binding/declarative-simple",
            data: {
                title: "Model binding - declarative - simple",
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
            view: "views/dynamic-data/remote-data-example/frameworks",
            data: {
                title: "Remote data - master detail example",
                category: "dynamic"
            }
        }, 

        "/remote-data-example/details": {
            view: "views/dynamic-data/remote-data-example/framework-details",
            paramsMap: params => {
                if (params.length !== 1) {
                    return false;
                }
                return params[0];
            },
        },

        "/github-user-info-example": {
            view: "views/dynamic-data/remote-data-example/github-user-info-example",
            data: {
                title: "github user info example",
                category: "dynamic"
            }
        },

        "/github-user-info": {
            view: "views/dynamic-data/remote-data-example/github-user-info",
            paramsMap: params => {
                if (params.length !== 1) {
                    return false;
                }
                return params[0];
            },
        },

        "/crossdomain-module-example": {
            view: "http://localhost:8080/module1.js",
            data: {
                title: "Crossdomain module example",
                category: "dynamic"
            }
        }, 

        "/crossdomain-template-example": {
            view: "cors-template!http://localhost:8080/template1.html",
            data: {
                title: "Crossdomain template example",
                category: "dynamic"
            },
            paramsMap: params => {
                return {
                    foo: "bar"
                }
            },
        }, 

        "/crossdomain-text-example": {
            view: "cors-text!http://localhost:8080/text-module1.html",
            data: {
                title: "Crossdomain text example",
                category: "dynamic"
            }
        }, 

    }
});
