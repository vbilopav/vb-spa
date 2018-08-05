define(["sys/test-prototype", "extension-Element/css"], test => {
        
    test(HTMLElement, ["hide"]);

    HTMLElement.prototype.hide = function() {
        this.css("display", "none");
        return this;
    }
});