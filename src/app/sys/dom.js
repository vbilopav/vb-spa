define([], () => {
    let dom = (e) => {    
        if (e._domExtended) {
            return e;
        }        
        if(typeof e === "string") {
            e = document.body.querySelector(e);
        }        
        e.q = function (s) { 
            return dom(this.querySelector(s)); 
        }
        e.show = function () {
            this.style.display = ""; 
            return this;
        }
        e.hide = () => {
            e.style.display = "none"; 
            return this;
        }
        e.set = function (s) { 
            this.innerHTML = s;
            return this;
        }
        e._domExtended = true;
        return e;
    }
    /*
    dom.create = function (s) { 
        return dom(document.createElement(s));
    }
    */
    return dom;
});