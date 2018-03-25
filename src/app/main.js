requirejs.config({
    paths: {
        text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        template: "sys/template"
    }
});
define(["app"], app => {
    
    //"sys/template-helpers"
    //h.usePreloaded();
    //h.add({foo: () => "bar", bar: () => "foo"});

    app();

});
