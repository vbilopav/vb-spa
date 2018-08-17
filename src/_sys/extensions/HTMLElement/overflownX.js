define(["sys/test-proto"], test => {

    test(HTMLElement, ["overflownX"]);

    HTMLElement.prototype.overflownX = function() {
        return this.scrollWidth > this.clientWidth;
    }
});