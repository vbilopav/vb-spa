define(["sys/template/html-helpers", "sys/test-proto"], (html, test) => {

    test(String, ["toHTML"]);

    String.prototype.toHTML = function() {
        return html.strToElement(this);
    }
});