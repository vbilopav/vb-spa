define([
    "routes/templates",
    "routes/modules",
    "routes/dynamic"
], (
    templates,
    modules,
    dynamic
) => {

    return Object.assign({

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
    dynamic)
});
