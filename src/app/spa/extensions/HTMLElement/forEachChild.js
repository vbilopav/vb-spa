define(["spa/test-prototype"], test => {

    test(HTMLElement, ["forEachChild"]);

    HTMLElement.prototype.forEachChild = function(callback=()=>{}, callFirst=false) {
        if (callFirst) {
            callback(this);
        }
        if (this.children.length) {
            for(let e of this.children) {
                e.forEachChild(callback, true);
            }
        }
        return this;
    }
});