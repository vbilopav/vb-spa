/*
The MIT License (MIT)
Copyright (c) 2018 Vedran Bilopavlović
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define([], () => {
    
    testPrototypeExtension = (object, extensions) => {
        extensions.forEach(e => {
            if (object.prototype[e] !== undefined) {
                throw new Error(`Error: Name collision - object ${object} already have defined "${e}" !`);
            }
        });
    }

    testPrototypeExtension(HTMLElement, [
        "find", "findAll", "show", "hide", "html", "appendTo", "addClass", "removeClass", "on", "off", "createElement"
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

    
    HTMLElement.prototype.append = function(element) {
        this.appendChild(element);
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

    testPrototypeExtension(String, ["hashCode", "html"]);

    String.prototype.hashCode = function() {
        let h = 0;
        for (let i = 0, len = this.length; i < len; i++) {
            let c = this.charCodeAt(i);
            h = ((h<<5)-h)+c;
            h = h & h;
        }
        return h;
    }

    //
    // lit-html vs code extension support
    //
    String.html = (pieces, ...args) => String.raw(pieces, ...args)

});