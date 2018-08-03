define(["sys/html", "sys/test-prototype"], (html, test) => {

    test(String, ["createElement"]);

    String.prototype.createElement = function(id, content) {
        return html.tagToElement(this, id, content);
    }
});