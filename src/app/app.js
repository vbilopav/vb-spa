define([
    "template!templates/layout.html",
    "spa/router",
    "spa/view-manager",
    "routes/main"
], (
    layout,
    Router,
    Manager,
    routes
) => {

    var 
        navigation;
        
    const
        router = new Router({
            routes: routes,
            navigate: event => navigation.find("#" + event.route.id).addClass("active"),
            leave: event => !event.route.id || navigation.find("#" + event.route.id).removeClass("active"),
            error: event => event.router.reveal("/not-found")
        });
        
    return () => {
        const routerData = router.getData();
        const app = document.body.find("#app-container").html(
            layout({
                home: routerData.filter(item => item.id == "home")[0],
                templates: routerData.filter(item => item.category == "templates"),
                modules: routerData.filter(item => item.category == "modules"),
                dynamic: routerData.filter(item => item.category == "dynamic")
            })
        );

        document.body.find("#loading-screen").remove();
        document.body.find("#loading-screen-script").remove();

        navigation = document.body.find("#navigation");

        router.useViewManager(
            new Manager(document.body.find("#container"))
        ).start();

        app.show();
    }
});
