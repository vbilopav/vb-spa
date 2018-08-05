define([
    "sys/router",
    "sys/view-manager",
    "sys/model",
    "template!templates/layout.html",
    "routes/main",
    "extension-Element/addClass",
    "extension-Element/removeClass"
], (
    Router,
    Manager,
    Model,
    layout,
    routes
) => {

    document.title = "SPA app demo";
        
    return () => {
        var app;

        const 
            page = new Model().bind(document.body),
            validRoute = route => route && route.id && route.id !== "not-found",
            router = new Router({
                routes: routes,
                navigate: event => validRoute(event.route) && app[event.route.id.toCamelCase()].addClass("active"),
                leave: event => validRoute(event.route) && app[event.route.id.toCamelCase()].removeClass("active"),
                error: event => event.router.reveal("/not-found")
            }),
            routerData = router.getData();

        page.appContainer.html(
            layout({
                home: routerData.filter(item => item.id == "home")[0],
                templates: routerData.filter(item => item.category === "templates"),
                modules: routerData.filter(item => item.category === "modules"),
                dynamic: routerData.filter(item => item.category === "dynamic"),
                components: routerData.filter(item => item.category === "components"),
            })
        );

        app = new Model().bind(page.appContainer);

        page.loadingScreen.remove();
        page.loadingScreenScript.remove();
        router.useViewManager(new Manager(app.container)).start();
        page.appContainer.show();
    }
});
