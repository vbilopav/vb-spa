/*
The MIT License (MIT)
Copyright (c) 2018 Vedran Bilopavlović
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define([], () => class {

    constructor(model) {
        this._model = model;
    }

    bind(element) {
        let search = "input, select, button, span, div, a";
        if (!this._model) {
            element.findAll(search).forEach((e) => {this._forEachDeclarative(e)});
        } else {
            element.findAll(search).forEach((e) => {this._forEachProgrammatic(e)});
        }
        return this;
    }
    
    _forEachDeclarative(element) {
        // name first, id second
        if (!this._assignProps(element.name || element.id, element)) {
            return;
        }
        for(let dataset in element.dataset) {
            if (!dataset.startsWith("event")) {
                continue;
            }
            element.on(dataset.replace("event", "").toLowerCase(), this[element.dataset[dataset]]);
        }
    }

    _forEachProgrammatic(element) {
        for(let name in this._model) {
            let m = this._model[name];
            if (typeof m === "string") {
                if (m === element.name || m === element.id) {
                    this._assignProps(name, element);
                }
            } else {
                if (m(element)) {
                    this._assignProps(name, element);
                }
            }
        }
    }

    _assignProps(name, element) {
        if (!name) {
            return false;
        }
        let node = element.nodeName;
        Object.defineProperty(this, name, {
            get: () => {
                if (node === "SELECT") {
                    return element.options[element.selectedIndex];
                }
                return element;
            },
            set: value => {
                if (node === "SELECT" || node === "INPUT") {
                    if (node === "INPUT" && element.type === "checkbox") {
                        element.checked = value;
                    } else {
                        element.value = value;
                    }
                } else {
                    element.html(value);
                    if (node === "A") {
                        element.href = value;
                    }
                }
            }
        });
        return true;
    }
});
