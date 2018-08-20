define(["sys/models/test-proto", "extension-Element/css"], test => {
        
    test(HTMLElement, ["hide"]);

    HTMLElement.prototype.hide = function() {
        this.css("display", "none");
        return this;
    }
});