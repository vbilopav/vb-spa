define([], () => class {

    constructor(model) {
        this._model = model;  //{name: f(model)=>bool}
    }

    bind(element) {
        let search = "input, select, button, span, div";
        if (!this._model) {
            element.findAll(search).forEach((e) => {this._forEachDeclarative(e)});
        } else {
            element.findAll(search).forEach((e) => {this._forEachProgramatic(e)});
        }
    }
    
    _forEachDeclarative(element) {
        let name = element.name || element.id; // name first, id second        
        if (!name) {
            return;
        }
        this._assignProps(name, element);
        for(let dataset in element.dataset) {            
            if (!dataset.startsWith("event")) {
                continue;
            }
            element.on(dataset.replace("event", "").toLowerCase(), this[element.dataset[dataset]]);
        }
    }

    _forEachProgramatic(element) {
        for(let name in this._model) {
            let f = this._model[name];
            if (!f || !f(this)) {
                continue;
            }            
            this._assignProps(name, element);                          
        }
    }   

    _assignProps(name, element) {
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
                    element.value = value;
                } else {
                    element.html(value);
                }
            }
        });  
    }
});
