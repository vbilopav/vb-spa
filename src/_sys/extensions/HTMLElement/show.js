define(["sys/test-prototype", "e-Element/css"], test => {
        
    test(HTMLElement, ["show"]);

    HTMLElement.prototype.show = function(state) {
        if (state !== undefined) {
            if (!state) {
                return this.hide();
            }
        }
        this.css("display", "");
        return this;
    }
});