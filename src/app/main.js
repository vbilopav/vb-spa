requirejs.config({
    paths: {
        text: [
            "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min", 
            (window._spa.libsUrl ? "../" + window._spa.libsUrl : "") + "text"
        ],
        template: "sys/template"
    }
});
define(["app", "sys/extensions"], app => app());
