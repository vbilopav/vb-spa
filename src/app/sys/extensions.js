define([], () => {
    
    HTMLElement.prototype.find = function(search) {
        let e = this.querySelector(search)
        if (!e) {
            e = "dummy".createElement();
            e.found = false;
            return e;
        }
        e.found = true;
        return e;
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

    HTMLElement.prototype.addClass = function(className) {
        if (this.classList) {
            this.classList.add(className);
        } else {
            this.className += " " + className;    
        }
        return this;  
    }

    HTMLElement.prototype.removeClass = function(className) {
        if (this.classList) {
            this.classList.remove(className);
        } else {
            this.className = this.className.replace(
                new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " "
            );
        }        
        return this;  
    }

    HTMLElement.prototype.on = function(eventName, eventHandler) {
        this.addEventListener(eventName, eventHandler);
        return this;
    }

    HTMLElement.prototype.off = function(eventName, eventHandler) {
        this.removeEventListener(eventName, eventHandler);
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

    String.prototype.hashCode = function() {
        let h = 0;
        for (let i = 0, len = this.length; i < len; i++) {
            let c = this.charCodeAt(i);
            h = ((h<<5)-h)+c;
            h = h & h;
        }
        return h;
    }

});