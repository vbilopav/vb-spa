define([
    "template!templates/layout.html",    
    "sys/router",
    "sys/view-manager"    
], (
    layout,
    Router,
    Manager
) => {

    var
        container,
        navigation;        
        
    const               
        //we need this callback since router must be creted before navigation element,
        //so that nav item can be populated by router data
        getNavElement = selector => navigation.q(selector),
        router = new Router({
            routes: {
                "/": {
                    id: "home",
                    view: "text!views/home.html", 
                    data: {
                        getNavElement: () => getNavElement("#home"),
                        title: "Home"
                    }
                },
                "/parameterized": {
                    view: "template!views/parameterized.html", 
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
                        getNavElement: () => getNavElement("#parameterized"),
                        title: "Parameterized"
                    }
                }
            },
            "/not-found": {
                view: "text!templates/not-found.html"
            },
            navigate: event => {
                //event.route.data.getNavElement().className = "active"
            },
            leave: event => {
                //!event.route || (event.route.data.getNavElement().className = "")
            },
            error: event => event.router.navigate("/not-found")
        });
        
    return () => {    
        // get reference to container element set content of layout template
        const app = document.body.q("#app-container").html(layout({
            brandText: "SPA demo",
            navData: router.getData()
        }));

        // remove loading element and loading script
        document.body.q("#loading-screen").remove();
        document.body.q("#loading-screen-script").remove();

        // get reference to navigation element
        navigation = document.body.q("#navigation");
        
        //get reference to view container
        container = document.body.q("#container");

        // start app routing
        router.useViewManager(new Manager(container)).start();

        // show the app
        app.show();
    }
});
