define(["sys/html", "sys/test-prototype"], (html, test) => {
        
    test(HTMLElement, ["find"]);
    
    HTMLElement.prototype.find = function(search) {
        let e = this.querySelector(search);
        if (!e) {
            e = html.tagToElement("dummy");
            e.length = 0;
            return e;
        }
        e.length = 1;
        return e;
    }
});