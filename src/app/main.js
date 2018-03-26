requirejs.config({
    paths: {
        text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        template: "sys/template"
    }
});
_app = Object.assign(_app || {version: "1", settings: {}}, {
    e: e => {
        e.q = (s) => e.querySelector(s);
        e.show = () => {e.style.display = ""; return e}
        e.hide = () => {e.style.display = "none"; return e}
        e.set = (s) => {e.innerHTML = s; return e}
        return e;
    }
});
define(["app"], app => app());
