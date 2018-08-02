define(["spa/test-prototype"], test => {

    test(HTMLElement, ["setFocus"]);

    HTMLElement.prototype.setFocus = function() {
        this.focus();
        return this;
    }
});