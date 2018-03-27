requirejs.config({
    paths: {
        text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        template: "sys/template"
    }
});
define(["app", "sys/dom-extensions"], app => app());
