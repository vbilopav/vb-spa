define(["spa/test-prototype"], test => {

    test(HTMLElement, ["findAll"]);

    HTMLElement.prototype.findAll = function(search) {
        return this.querySelectorAll(search);
    }
});