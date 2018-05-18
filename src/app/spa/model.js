define([], () => class {

    constructor({model, oncreate}={}) {
        this._model = model;
        this._oncreate = oncreate || (()=>{});
        this._instance = undefined;
        this._names = [];
    }

    bind(element, instance) {
        let search = "input, select, button, span, div, a";
        this._instance = instance || Object.assign({}, this);
        if (!this._model) {
            element.findAll(search).forEach(e => {this._forEachDeclarative(e)});
        } else {
            element.findAll(search).forEach(e => {this._forEachProgrammatic(e)});
        }
        return this;
    }

    each(callback) {
        for(var name of this._names) {
            callback(this[name], name);
        }
    }

    _forEachDeclarative(element) {
        // name first, id second
        if (!this._assignProps(element.name || element.id, element)) {
            return;
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

    _assignEvents(element) {
        let attrs = element.attributes;
        for(let i = 0, l = attrs.length; i < l; i++) {
            let node = attrs[i], attr = node.name;
            if (!attr.startsWith("on")) {
                continue;
            }
            let val = this._instance[node.value];
            if (typeof val !== "function") {
                continue;
            }
            element.removeAttribute(attr);
            let instance = this._instance;
            element.on(attr.replace("on", "").toLowerCase(), function(e) {
                val.call(instance);
            });
        }
    }

    _assignValue(node, element, value) {
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

    _getValue(node, element) {
        if (node === "SELECT") {
            return element.options[element.selectedIndex];
        }
        return element;
    }

    _assignProps(name, element) {
        if (!name) {
            return false;
        }
        this._assignEvents(element);
        let node = element.nodeName, that = this;
        Object.defineProperty(this, name, {
            get: () => that._getValue(node, element),
            set: value => that._assignValue(node, element, value)
        });
        this._names.push(name);
        this._oncreate(element);
        let value = this._instance[name];
        if (value === undefined) {
            return true;
        }
        this._assignValue(node, element, value);
        return true;
    }
});
