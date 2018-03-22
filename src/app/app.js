define([
    "template!templates/layout.html",
    "router"
], (
    layout,
    Router
) => {
    
    var        
        container,        
        navigation;

    const 
        body = document.body,
        router = new Router({            
            navigate: (options) => {
                // template holds actual html content
                container.innerHTML = options.template,
                // change active class on navigation element - home doesn't have an id, other just use route name
                navigation.querySelector(options.route ? options.route : ":not([id])").className = "active";
            },
            routes: {
                "": {
                    view: "text!views/home.html"                    
                }
            }
        });


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

        // start app routing
        router.start();
        
        //show app
        app.style.display = '';        
    }
});
