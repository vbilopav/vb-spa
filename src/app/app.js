define([
    "template!templates/layout.html",
    "text!templates/not-found.html",
    "sys/router",
    "sys/view-manager",
], (
    layout,
    notFound,
    Router,
    Manager
) => {

    var
        container,
        navigation;        
    
    const
        _q = (e, s) => _app.e(e).q(s),
        body = document.body,
        //we need this callback since router must be creted before navigation element,
        //so that nav item can be populated by router data
        getNavElement = selector => _q(navigation, selector),
        router = new Router({
            routes: {
                "": {
                    // id is set automatically from name, however, we use this to render id of nav element
                    // and name of home is empty
                    id: "home",
                    view: "text!views/home.html", 
                    data: {
                        getNavElement: () => getNavElement("#home"),
                        title: "Home"
                    }
                },
                "parameterized": {
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
            navigate: event => event.route.data.getNavElement().className = "active",
            leave: event => !event.route || (event.route.data.getNavElement().className = ""),
            error: event => container.innerHTML = notFound
        });
        
    return () => {    
        // reference to container element
        const app = _q(body, "#app-container");
        
        // draw main layout
        app.innerHTML = layout({
            brandText: "SPA demo",
            navData: router.getData()
        });

        // remove loading element and loading script
        _q(body, "#loading-screen").remove();
        _q(body, "#loading-screen-script").remove();

        // get reference to navigation element
        navigation = _q(body, "#navigation");
        
        //get reference to view container
        container = _q(app, "#container");

        // start app routing
        router.useViewManager(new Manager(container)).start();

        // show the app
        app.style.display = "";
    }
});
