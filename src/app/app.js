define([
    "composite!templates/layout.html",
    "router"
], (
    layout,
    Router
) => {
    
    var        
        container,        
        navigation,
        body = document.body;

    return () => {    
        // refernce to container element
        const app = body.querySelector("#app-container");
        
        // draw main layout
        app.innerHTML = layout({
            brandText: "VB-SPA demo"
        });

        // remove loading element and loading script
        body.querySelector("#loading-screen").remove();
        body.querySelector("#loading-screen-script").remove();

        // get reference to navigation element
        navigation = body.querySelector("#navigation");
        
        //get reference to view container
        container = app.querySelector("#container");

        // configure and start app routing
        router = new Router({            
            navigate: (options) => {
                // template holds actual html content
                container.innerHTML = options.template,
                // change active class on navigation element - home doesn't have an id, other just use route name
                options.data.nav.className = "active";    
            },
            leave: (options) => {
                console.log(options);
            },
            routes: {
                "": {view: "text!views/home.html", nav: navigation.querySelector(":not([id])")},
                "parameterized": {view: "template!views/parameterized.html", nav: navigation.querySelector("#parameterized")}
            }
        }).start();
        
        //show app
        app.style.display = '';        
    }
});
