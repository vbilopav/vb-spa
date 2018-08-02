define(["spa/test-prototype"], test => {

    test(HTMLElement, ["appendTo"]);

    HTMLElement.prototype.appendTo = function(e) {
        e.append(this);
        return this;
    }
});