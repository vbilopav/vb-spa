/*
The MIT License (MIT)
Copyright (c) 2018 Vedran Bilopavlović
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define([
    "template!templates/layout.html",
    "sys/router",
    "sys/view-manager",
    "routes"
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
        routerData = router.getData();
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
