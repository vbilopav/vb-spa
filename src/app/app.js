define([
    "composite!templates/layout.html",
    "text!templates/not-found.html",
    "router"
], (
    layout,
    notFound,
    Router
) => {

    var
        container,
        navigation;        
    
    const
        body = document.body,
        //we need this callback since router must be creted before navigation element,
        //so that nav item can be populated by router data
        getNavElement = selector => navigation.querySelector(selector)
        router = new Router({
            routes: {
                "": {
                    view: "text!views/home.html", 
                    data: {
                        id: "home",
                        getNavElement: () => getNavElement("#home"),
                        title: "Home"
                    }
                },
                "parameterized": {
                    view: "template!views/parameterized.html", 
                    data: {
                        id: "parameterized",
                        getNavElement: () => getNavElement("#parameterized"),
                        title: "Parameterized"
                    }
                }
            },
            navigate: event => {
                // template holds actual html content
                container.innerHTML = event.template,
                // change active class on navigation element - home doesn't have an id, other just use route name
                event.route.data.getNavElement().className = "active";
            },
            leave: event => event.route.data.getNavElement().className = "",
            error: event => container.innerHTML = notFound
        });
        
    return () => {    
        // reference to container element
        const app = body.querySelector("#app-container");
        
        // draw main layout
        app.innerHTML = layout({
            brandText: "SPA demo",
            navData: router.getData()
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

        //show the app
        app.style.display = '';        
    }
});
