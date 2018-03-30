define(["template!views/modules/_default.html"], (template) => template({
    header: "This is module view that returns plain-text (from another template)",
    firstLine: "View modules can return simple, plain text.",
    secondLine: 
        `<br />This is useful when you need to display complex template that requires 
        more complex rendering logic or some type of complex preprocessing before text template is displayed.`,
    viewLocation: "/app/views/modules/simple-text.js",
    routeDefintion: `"/module-simple-text": {
    view: "views/modules/simple-text",
    data: {
        title: "Simple text from module",
        category: "modules"
    }
}`,
    closingLine: "For this type of module view any parameters must be processed and parsed manually..."
}));
