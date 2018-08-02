define(["spa/test-prototype"], test => {
        
    test(HTMLElement, ["html"]);

    HTMLElement.prototype.html = function(content) {
        if (content === undefined) {
            return this.innerHTML;
        }
        this.innerHTML = content;
        return this;
    }
});