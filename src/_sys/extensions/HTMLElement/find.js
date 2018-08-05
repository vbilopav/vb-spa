define(["sys/html-parsers", "sys/test-prototype"], (parser, test) => {
        
    test(HTMLElement, ["find"]);
    
    HTMLElement.prototype.find = function(search) {
        let e = this.querySelector(search);
        if (!e) {
            e = parser.tagToElement("dummy");
            e.length = 0;
            return e;
        }
        e.length = 1;
        return e;
    }
});