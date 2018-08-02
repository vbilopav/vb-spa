define(["spa/test-prototype"], test => {

    test(HTMLElement, ["overflownY"]);

    HTMLElement.prototype.overflownY = function() {
        return this.scrollHeight > this.clientHeight;
    }
});