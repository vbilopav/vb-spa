define([
    "template!templates/layout.html",
    "text!templates/not-found.html",
    "sys/router",
    "sys/view-manager",
    "sys/dom",
], (
    layout,
    notFound,
    Router,
    Manager,
    $
) => {

    var
        container,
        navigation;        
        
    const               
        //we need this callback since router must be creted before navigation element,
        //so that nav item can be populated by router data
        getNavElement = selector => $(navigation).q(selector),
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
        // get reference to container element set content of layout template
        const app = $("#app-container").set(layout({
            brandText: "SPA demo",
            navData: router.getData()
        }));
        app.q("#navbar").hide();
        // remove loading element and loading script
        $("#loading-screen").remove();
        $("#loading-screen-script").remove();

        // get reference to navigation element
        navigation = $("#navigation");
        
        //get reference to view container
        container = $("#container");

        // start app routing
        router.useViewManager(new Manager(container)).start();

        // show the app
        app.show();
    }
});
