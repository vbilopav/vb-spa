define(["spa/html"], html => {
        
    const 
        test = (object, extensions) => {
            extensions.forEach(e => {
                if (object.prototype[e] !== undefined) {
                    throw new Error(`Error: Name collision - object ${object} already have defined "${e}" !`);
                }
            });
        };

    test(HTMLElement, [
        "find", "findAll", "forEachChild",
        "show", "hide", "visible", "html", 
        "appendTo",
        "addClass", "removeClass", "hasClass", "toggleClass",
        "attr",
        "css", "_styles",
        "on", "off", "trigger",
        "data", "_data",
        "overflownX", "overflownY",
        "setFocus"
    ]);
    test(String, ["html", "hashCode", "createElement"]);
    test(NodeList, ["addClass", "removeClass", "toggleClass", "show", "hide"]);
    test(Document, ["on", "off", "trigger", "find", "findAll"]);
    test(Window, ["on", "off", "trigger"]);

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

    HTMLElement.prototype.findAll = function(search) {
        return this.querySelectorAll(search);
    }

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

    HTMLElement.prototype.show = function(state) {
        if (state !== undefined) {
            if (!state) {
                return this.hide();
            }
        }
        this.css("display", "");
        return this;
    }

    HTMLElement.prototype.hide = function() {
        this.css("display", "none");
        return this;
    }

    HTMLElement.prototype.visible = function(state) {
        if (state !== undefined) {
            if (!state) {
                return this.css("visibility", "hidden");
            }
        }
        this.css("visibility", "visible");
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

    HTMLElement.prototype.attr = function(key, value) {
        if (value === undefined) {
            return this.getAttribute(key);
        }
        this.setAttribute(key, value);
        return this;
    }

    HTMLElement.prototype.html = function(content) {
        if (content === undefined) {
            return this.innerHTML;
        }
        this.innerHTML = content;
        return this;
    }

    HTMLElement.prototype.addClass = function(className) {
        if (this.classList) {
            this.classList.add(className);
        } else {
            this.className += ` ${className}`;
        }
        return this;
    }

    HTMLElement.prototype.removeClass = function(className) {
        if (this.classList) {
            this.classList.remove(className);
        } else {
            this.className = this.className.replace(
                new RegExp(`(^|\\b)${className.split(" ").join("|")}(\\b|$)`, "gi"), " "
            );
        }
        return this;
    }

    HTMLElement.prototype.hasClass = function(className) {
        if (this.classList) {
            return this.classList.contains(className);
        } else {
            return new RegExp(`(^| )${className}( |$)`, "gi").test(this.className);
        }
    }

    HTMLElement.prototype.toggleClass = function(className, state) {
        if (state !== undefined) {
            if (!state) {
                this.removeClass(className);
            } else {
                this.addClass(className);
            }
            return this;
        }
        if (this.hasClass(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
        return this;
    }

    const _toCamelCase = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

    HTMLElement.prototype.css = function(property, value) {
        if (!this._styles) {
            this._styles = {};
            const styles = window.getComputedStyle(this);
            for(let style in styles) {
                if (styles.hasOwnProperty(style)) {
                    if (!isNaN(style)) {
                        continue;
                    }
                    this._styles[style] = styles[style];
                }
            }
        }
        if (value !== undefined) {
            this._styles[property] = value;
            this.style[property] = value;
            return this;
        }
        const result = this._styles[property];
        if (result === undefined) {
            return this._styles[_toCamelCase(property)];
        }
        return result;
    }

    HTMLElement.prototype.on = function(eventName, eventHandler) {
        for(let e of eventName.split(" ")) {
            this.addEventListener(e, eventHandler);
        }
        return this;
    }

    HTMLElement.prototype.off = function(eventName, eventHandler) {
        for(let e of eventName.split(" ")) {
            this.removeEventListener(e, eventHandler);
        }
        return this;
    }

    HTMLElement.prototype.trigger = function(eventName) {
        for(let e of eventName.split(" ")) {
            this.dispatchEvent(new Event(e));
        }
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

    HTMLElement.prototype.overflownX = function() {
        return this.scrollWidth > this.clientWidth;
    }

    HTMLElement.prototype.overflownY = function() {
        return this.scrollHeight > this.clientHeight;
    }

    HTMLElement.prototype.setFocus = function() {
        this.focus();
        return this;
    }

    NodeList.prototype.addClass = function(className) {
        for(let e of this) {
            e.addClass(className);
        }
        return this;
    }

    NodeList.prototype.removeClass = function(className) {
        for(let e of this) {
            e.removeClass(className);
        }
        return this;
    }

    NodeList.prototype.toggleClass = function(className, state) {
        for(let e of this) {
            e.toggleClass(className, state);
        }
        return this;
    }

    NodeList.prototype.show = function(state) {
        for(let e of this) {
            e.show(state);
        }
        return this;
    }

    NodeList.prototype.hide = function() {
        for(let e of this) {
            e.hide();
        }
        return this;
    }

    Document.prototype.on = HTMLElement.prototype.on;
    Document.prototype.off = HTMLElement.prototype.off;
    Document.prototype.trigger = HTMLElement.prototype.trigger;
    Document.prototype.find = HTMLElement.prototype.find;
    Document.prototype.findAll = HTMLElement.prototype.findAll;
    Window.prototype.off = HTMLElement.prototype.off;
    Window.prototype.on = HTMLElement.prototype.on;
    Window.prototype.trigger = HTMLElement.prototype.trigger;

    String.prototype.hashCode = function() {
        let h = 0;
        for (let i = 0, len = this.length; i < len; i++) {
            let c = this.charCodeAt(i);
            h = ((h<<5)-h)+c;
            h = h & h;
        }
        return h;
    }

    String.prototype.createElement = function(id, content) {
        return html.tagToElement(this, id, content);
    }

    //
    // lit-html vs code extension support
    //
    String.html = (pieces, ...args) => String.raw(pieces, ...args);

    navigator.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    navigator.isEdge = window.navigator.userAgent.indexOf("Edge") > -1;
    navigator.onLinux = window.navigator.platform.indexOf("Linux") > -1;
});