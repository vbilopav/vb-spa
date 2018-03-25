requirejs.config({
    paths: {
        text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        template: "sys/templating/template",
        preloaded: "sys/templating/preloaded",
    }
});
define(["app"], app => {
    
    app();

});
