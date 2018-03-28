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
        navigation;        
        
    const
        router = new Router({
            routes: {
                "/": {
                    id: "home",
                    view: "text!views/home.html",
                    data: {
                        title: "Home"
                    }
                },
                "/plain-text": {                    
                    view: "text!views/templates/plain-text-view.html",
                    data: {
                        title: "Plain text view",
                        category: "templates"
                    }
                },     
                "/keep-state": {                    
                    view: "text!views/templates/state-view.html",
                    data: {
                        title: "Plain text view - state handling",
                        category: "templates"
                    }
                }, 
                "/parameterized": {
                    view: "template!views/templates/parameterized.html", 
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
                        title: "Parameterized",
                        category: "templates"
                    }
                },
                "/parameterized/sub-route": {
                    view: "template!views/templates/parameterized-sub-route.html", 
                    paramsMap: (...params) => {
                        if (params.length > 1) {
                            return false;
                        }                        
                        return {
                            firstAndOnly: params[0]                            
                        };
                    },
                    data: {                        
                        title: "Parameterized sub route",
                        category: "templates"
                    }
                },
                "/composite": {
                    view: "template!views/templates/composite.html",                    
                    data: {                        
                        title: "Composite template",
                        category: "templates"
                    }
                },
                "/composite-parametrized": {
                    view: "template!views/templates/composite-parametrized.html",                    
                    data: {                        
                        title: "Composite parametrized template",
                        category: "templates"
                    }
                },
                "/not-found": {
                    view: "text!views/not-found.html"
                },
            },
            navigate: event => navigation.q("#" + event.route.id).addClass("active"),
            leave: event => navigation.q("#" + event.route.id).removeClass("active"),                
            error: event => event.router.navigate("/not-found")
        });
        
    return () => {        
        routerData = router.getData();
        const app = document.body.q("#app-container").html(
            layout({
                home: routerData.filter(item => item.id == "home")[0],
                templates: routerData.filter(item => item.category == "templates")
            })
        );

        document.body.q("#loading-screen").remove();
        document.body.q("#loading-screen-script").remove();

        navigation = document.body.q("#navigation");        

        router.useViewManager(
            new Manager(document.body.q("#container"))
        ).start();

        app.show();
    }
});
