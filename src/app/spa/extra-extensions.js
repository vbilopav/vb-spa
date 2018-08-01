define(["spa/test-prototype"], test => {

    test(HTMLElement, [
        "findAll", "visible", "attr", "appendTo", "hasClass", "toggleClass", "off", "trigger",
        "data", "_data", "overflownX", "overflownY", "setFocus"
    ]);
    test(NodeList, ["addClass", "removeClass", "toggleClass", "show", "hide"]);
    test(Document, ["on", "off", "trigger", "find", "findAll"]);
    test(Window, ["on", "off", "trigger"]);

    HTMLElement.prototype.findAll = function(search) {
        return this.querySelectorAll(search);
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

    HTMLElement.prototype.attr = function(key, value) {
        if (value === undefined) {
            return this.getAttribute(key);
        }
        this.setAttribute(key, value);
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

});