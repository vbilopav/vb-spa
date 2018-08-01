define(["spa/html", "spa/test-prototype"], (html, test) => {
        
    test(HTMLElement, [
        "find", "forEachChild", "show", "hide", "html", "appendTo", "addClass", "removeClass", "css", "_styles", "on", "setFocus"
    ]);
    test(String, ["html", "hashCode", "createElement"]);

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

    HTMLElement.prototype.appendTo = function(e) {
        e.append(this);
        return this;
    }

    HTMLElement.prototype.append = function(element) {
        this.appendChild(element);
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
});