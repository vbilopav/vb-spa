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
        if (!this._assignProps(element.name || element.id, element)); {
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
