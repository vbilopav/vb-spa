define(["template!views/modules/_default.html"], template => {        
    
    return {

        //
        // constructor is init method, and it is optional, it receives view id and view element
        //

        init: (id, element) => {        
            console.log(id + " created");
            // remember element reference (note: element is also second parameter in render and change)
            this.element = element
        },

        //
        // The render method here doesn't return anything, it just directly adds html to element 
        // by calling html helper (which replaces innerHTML, see extensions module)
        //
        // You coud also use addChildren, append, some your special jQuery magic perhaps, or whatever...
        //

        render: params => {
            this.element.html(template({
                header: 
                    "Object module with direct element manipulation.",
                firstLine: 
                    "Change and render method doesn't have to return anything to render content.<br />",
                secondLine:                 
                    "In this example render and change will not return template string to render.<br />" +
                    "Instead, element is directly manipulated by using HTMLElement methods.",
                viewLocation: 
                    "/app/views/modules/object-module-element-manipulation.js",
                routeDefintion: 
                    '"/object-module-element-manipulation": {\n' +
                    '    view: "views/modules/object-module-element-manipulation",\n' +
                    '    data: {\n' +
                    '        title: "Object module - element manipulation",\n' +
                    '        category: "modules"\n' +
                    '    },\n' +
                    '    paramsMap: (...params) => params\n' +
                    '}',
                closingLine: 
                    "For more info see comments in module js code...<br /><br />" +
                    "Here is the list of current params for this view (type them in address bar manually):<br /><span id='params'>" +
                    params.join("<br />") + "</span>"
            }))

            // search of params element and cache it so we can use it in change
            this.paramsElement = this.element.find("#params");
        },
        
        change: params => {
            this.paramsElement.html(params.join("<br />"))
        }

    }
});