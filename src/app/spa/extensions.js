define([], () => {
        
    const 
        test = (object, extensions) => {
            extensions.forEach(e => {
                if (object.prototype[e] !== undefined) {
                    throw new Error(`Error: Name collision - object ${object} already have defined "${e}" !`);
                }
            });
        };

    test(HTMLElement, [
        "find", "findAll", 
        "show", "hide", 
        "html", "appendTo",
        "css", "_styles", "addClass", "removeClass", 
        "on", "off",
        "data", "_data"
    ]);

    HTMLElement.prototype.find = function(search) {
        let e = this.querySelector(search);
        if (!e) {
            e = "dummy".createElement();
            e.length = 0
            return e;
        }
        e.length = 1;
        return e;
    }

    HTMLElement.prototype.findAll = function(search) {
        return this.querySelectorAll(search);
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
        if (content === undefined) {
            return this.innerHTML;
        }
        this.innerHTML = content;
        return this;
    }

    HTMLElement.prototype.appendTo = function(e) {
        e.append(this);
        return this;
    }

    HTMLElement.prototype.append = function(element) {
        this.appendChild(element);
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

    HTMLElement.prototype.css = function(property, value) {
        if (!this._styles) {
            this._styles = {};
            let styles = window.getComputedStyle(this);
            for(let style in styles) {
                if (!isNaN(style)) {
                    continue;
                }
                this._styles[style] = styles[style];
            }
        }
        if (value !== undefined) {
            this._styles[property] = value;
            this.style[property] = value;
            return this
        }
        let result = this._styles[property];
        if (result === undefined) {
            return this._styles[property.toCamelCase()];
        }
        return result;
    }

    HTMLElement.prototype.on = function(eventName, eventHandler) {
        this.addEventListener(eventName, eventHandler);
        return this;
    }

    HTMLElement.prototype.off = function(eventName, eventHandler) {
        this.removeEventListener(eventName, eventHandler);
        return this;
    }

    HTMLElement.prototype.data = function(key, value) {
        if (!this._data) {
            this._data = Object.assign({}, this.dataset);
        }
        if (value !== undefined) {
            this._data[key] = value;
            return this;
        }
        return this._data[key];
    }
    
    test(String, ["hashCode", "createElement", "toCamelCase"]);
    
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

    String.prototype.toCamelCase = function() {
        return this.replace(/-([a-z])/g, g => g[1].toUpperCase())
    }

    test(Document, ["on", "off"]);
    test(Window, ["on", "off"]);
    Document.prototype.on = HTMLElement.prototype.on;
    Window.prototype.off = HTMLElement.prototype.off;

    //
    // lit-html vs code extension support
    //
    String.html = (pieces, ...args) => String.raw(pieces, ...args)

});