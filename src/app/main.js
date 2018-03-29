requirejs.config({
    paths: {
        text: "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        template: "sys/template"
    }
});
define(["app", "sys/extensions"], app => app());
