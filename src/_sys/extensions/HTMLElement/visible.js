define(["sys/models/test-proto", "extension-Element/css"], test => {

    test(HTMLElement, ["visible",]);

    HTMLElement.prototype.visible = function(state) {
        if (state !== undefined) {
            if (!state) {
                return this.css("visibility", "hidden");
            }
        }
        this.css("visibility", "visible");
        return this;
    }
});