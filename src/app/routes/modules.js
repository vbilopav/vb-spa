define([], () => {

    return {

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
            paramsMap: params => params
        },
 
        "/class-module-change-element": {
            view: "views/modules/class-module-change-element",
            data: {
                title: "Class module with change method",
                category: "modules"
            },
            paramsMap: params => params
        },
 
        "/class-module-element-manipulation": {
            view: "views/modules/class-module-element-manipulation",
            data: {
                title: "Class module - element manipulation",
                category: "modules"
            },
            paramsMap: params => params
        },
 
        "/object-module-simple": {
            view: "views/modules/object-module-simple",
            data: {
                title: "Simple text from object module",
                category: "modules"
            },
            paramsMap: params => params
        },
 
        "/object-module-change-element": {
            view: "views/modules/object-module-change-element",
            data: {
                title: "Object module with change method",
                category: "modules"
            },
            paramsMap: params => params
        },
 
        "/object-module-element-manipulation": {
            view: "views/modules/object-module-element-manipulation",
            data: {
                title: "Object module - element manipulation",
                category: "modules"
            },
            paramsMap: params => params
        },

        "/view-events": {
            view: "views/modules/view-events",
            data: {
                title: "View events",
                category: "modules"
            },
            paramsMap: params => params
        },

        "/events-handlings": {
            view: "views/modules/events-handlings",
            data: {
                title: "Event handlings",
                category: "modules"
            }
        }, 

        "/new-bundle": {
            view: "views/modules/new-bundle/module-view",
            data: {
                title: "New bundle",
                category: "modules"
            }
        }, 


    }
});
