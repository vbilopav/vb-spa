define([
    "routes/templates",
    "routes/modules",
    "routes/dynamic",
    "routes/components",
], (
    templates,
    modules,
    dynamic,
    components
) => Object.assign({

        "/": {
            id: "home",
            view: "text!views/home.html",
            data: {
                title: "Home"
            }
        },

        "/not-found": {
            view: "text!views/not-found.html"
        }

    },

    templates,
    modules,
    dynamic,
    components
    
));
