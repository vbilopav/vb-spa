define(["template!views/modules/_default.html"], template => {

    return {

        //
        // constructor is init method, and it is optional, it receives view id and view element
        //

        init: id => console.log(id + " created"),

        //
        // The render method is required.
        // It receives params object and view element (in this example, we remembered in constructor)
        // The render will render any string it returns ... if it is returned
        //

        render: params => template({
            header: 
                "This is simple object module.",
            firstLine: 
                "View modules can return javascript objects!<br />",
            secondLine: 
                "This is simple example with render method that is called every time " +
                "parameters are changed or module is created and it returns simple text to be rendered.",
            viewLocation: 
                "/app/views/modules/class-module-simple.js",
            routeDefintion: 
                '"/object-module-simple": {\n' +
                '    view: "views/modules/object-module-simple"\n' +
                '    data: {\n' +
                '        title: "Simple text from object module",\n' +
                '        category: "modules"\n' +
                '    },\n' +
                '    paramsMap: (...params) => params\n' +
                '}',
            closingLine: 
                "For more info see comments in module js code...<br /><br />" +
                "Here is the list of current params for this view (type them in address bar manually):<br /><span id='params'>" +
                params.join("<br />") + "</span>"
        })
    }
});