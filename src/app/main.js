requirejs.config({
    paths: {
        text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        template: "plugins/template",
        composite: "plugins/composite",
    }
});
define(["app"], app => {    

   app();

});
