define(["sys/html-helpers", "sys/test-prototype"], (html, test) => {

    test(String, ["toHTML"]);

    String.prototype.toHTML = function() {
        return html.strToElement(this);
    }
});