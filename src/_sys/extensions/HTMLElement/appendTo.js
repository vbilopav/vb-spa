define(["sys/models/test-proto"], test => {

    test(HTMLElement, ["appendTo"]);

    HTMLElement.prototype.appendTo = function(e) {
        e.append(this);
        return this;
    }
});