define([], () => {
    
    HTMLElement.prototype.q = function(search) {
        return this.querySelector(search);
    }

    HTMLElement.prototype.show = function() {
        this.style.display = ""; 
        return this;
    }

    HTMLElement.prototype.hide = function() {
        this.style.display = "none"; 
        return this;
    }

    HTMLElement.prototype.html = function(content) {
        this.innerHTML = content;
        return this;
    }

    HTMLElement.prototype.appendTo = function(e) {
        e.append(this);
        return this;
    }

    String.prototype.createElement = function(id, content) {
        let e = document.createElement(this);
        if (id) {
            e.id = id;
        }
        if (content) {
            e.html(content);
        }
        return e;
    }    
});