define(["sys/test-prototype"], test => {

    test(HTMLElement, ["off"]);

    HTMLElement.prototype.off = function(eventName, eventHandler) {
        for(let e of eventName.split(" ")) {
            this.removeEventListener(e, eventHandler);
        }
        return this;
    }
});