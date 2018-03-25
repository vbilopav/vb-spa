define(["sys/template-helpers"], t => { 

    const 
        _templatePrefix = t._prefix,
        _type = {template: 1, class: 2, object: 3, string: 4},
        _getViewType = (view, name) => {
            if (typeof view === "function") {
                if (name.startsWith(_templatePrefix)) {
                    return _type.template;
                }                
                return _type.class;
            }
            if (typeof view === "object") {
                return _type.object;
            }
            return _type.string;
        }

    return class {    
        constructor(container=(() => {throw container})()) {
            this._container = container;
            this._views = {}
        }
        reveal(args) {
            return new Promise((resolve, reject) => {
                let item = this._hideAllExcept(args.id);            
                if (item) {
                    return resolve();
                } else {                    
                    this._newView(id, routeName, params);
                    return resolve();
                }
            });  
        }
        _newView(id, routeName, params) {
            require([routeName], view => {
                let template, type = this._getViewType(view, routeName)
                if (typeof view === "string") {
                    template = view;
                }
                else if (typeof view === "function") {
                    if (routeName.startsWith("template!")) {
                        template = view(params);
                    }
                    else {
                        let instance = new view(params);
                        template = view.render();
                    }
                }
                else if (typeof view === "object") {
                    view.init(params);
                    template = view.render();
                }
                let element = document.createElement("span");
                element.id = "_view-" + id;
                element.innerHTML = template;
                this._container.append(element);
                this._views[id] = {
                    element: element
                };
            });
        }
        _hideAllExcept(showId) {
            let shown;
            for (let id in this._views) {
                let item = this._views[id];
                if (id === showId) {
                    item.element.style.display = "";
                    shown = item;
                } else {
                    item.element.style.display = "none";
                }
            }
            return shown;
        }
    }

 });
 