define([

    "routes/templates",
    "routes/modules",
    "routes/dependency-injection",
    "routes/model-binding",
    "routes/remote-data",

], (

    templates,
    modules,
    di,
    binding,
    remote

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
    di,
    binding,
    remote,
    
));
