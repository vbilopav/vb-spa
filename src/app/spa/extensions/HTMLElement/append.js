define(["spa/test-prototype"], test => {

    //test(HTMLElement, ["append"]);

    HTMLElement.prototype.appendTo = function(e) {
        e.append(this);
        return this;
    }
});