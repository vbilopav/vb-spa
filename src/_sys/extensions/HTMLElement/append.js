define(["sys/models/test-proto"], test => {

    if (!test(HTMLElement, ["append"], false)) {
        HTMLElement.prototype.append = function(e) {
            e.appendChild(this);
            return this;
        }
    }
    
});