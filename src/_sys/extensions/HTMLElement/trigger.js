define(["sys/test-prototype"], test => {

    test(HTMLElement, ["trigger"]);

    HTMLElement.prototype.trigger = function(eventName) {
        for(let e of eventName.split(" ")) {
            this.dispatchEvent(new Event(e));
        }
        return this;
    }
});