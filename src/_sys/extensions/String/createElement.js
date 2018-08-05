define(["sys/html-parsers", "sys/test-prototype"], (parser, test) => {

    test(String, ["createElement"]);

    String.prototype.createElement = function(id, content) {
        return parser.tagToElement(this, id, content);
    }
});