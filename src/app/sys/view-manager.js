define(["sys/template-helpers", "sys/dom"], (_th, $) => {

    const 
        templatePrefix = _th._prefix,
        prefix = "_view-",
        getId = (id, uriHash) => prefix + id + uriHash,
        type = {template: 1, class: 2, object: 3, string: 4},
        getViewType = (view, name) => {
            if (typeof view === "function") {
                if (name.startsWith(templatePrefix)) {
                    return type.template;
                }                
                return type.class;
            }
            if (typeof view === "object") {
                return type.object;
            }
            return type.string;
        },
        hashCode = (s) => {
            let h = 0;
            for (var i = 0; i < s.length; i++) {
                let c = s.charCodeAt(i);
                h = ((h<<5)-h)+c;
                h = h & h;
            }
            return h;
        };

    return class {    
        constructor(
            container=(() => {throw container})()
        ) {
            this._container = $(container);
            this._views = {} //id,uri,type,instance
        }

        reveal(args) { //id,name,params,uri
            return new Promise((resolve, reject) => {
                let found,
                    uriHash = hashCode(args.uri),
                    elementId = prefix + args.id + uriHash;

                for (let id in this._views) {
                    let view = this._views[id];
                    if (id === args.id) {
                        found = view;
                    }
                    view.element.hide();
                }

                if (found) {

                    if (found.type === type.string) {
                        found.element.show();
                        return resolve();    
                    }    
                    
                    let element = _(this._container).q("#" + getId(elementId, uriHash)),
                        empty = false;
                    if (!element) {                        
                        element = _create("span")
                        element.id = getId(elementId, uriHash);
                        this._container.append(element);
                        empty = true;
                    }

                    if (found.type === type.template) {
                        
                        if (uriHash !== found.uriHash) {
                            found.uriHash = uriHash;
                            _set(found.element, found.instance(args.params));
                        }
                        _show(found.element);
                        return resolve();
                    }

                    if (found.type === type.class || found.type === type.object) {
                        this._showObject(found, args);    
                        return resolve();
                    }
                    
                }
                
                return this._newView(args, reject, resolve);            
            });  
        }



        _newView(args, reject, resolve) {
            require([args.name], view => {
                let content, 
                    type = getViewType(view, args.name), 
                    data = {
                        type: type, 
                        element: document.createElement("span"),
                        uriHash: hashCode(args.uri)
                    };
                data.element.id = prefix + args.id;
                _hide(data.element);

                if (type === type.string) {
                    _set(data.element, view);                    
                }

                else if (type === type.template) {
                    data.instance = view;
                    _set(data.element, view(args.params));
                }

                else if (type === type.class) {
                    data.instance = new view(args.id);
                    let content = view.create(args.params, data.element);
                    if (content) {
                        _set(data.element, content);
                    }
                }

                else if (type === type.object) {
                    data.instance = view;
                    view.init(args.id);
                    let content = view.create(args.params, data.element);
                    if (content) {
                        _set(data.element, content);
                    }
                }
                else {
                    return reject("unknown view type");
                }
                this._container.append(data.element);
                _show(data.element);
                if (type === type.class || type === type.object) {
                    data.instance.show(args.params, data.element);
                }
                this._views[args.id] = data;
                return resolve();
            });
        }






        _showObject(found, args) {
            if (found.uri !== args.uri) {
                if (found.instance.change) {
                    found.uri = args.uri
                    let content = found.instance.change(args.params, found.element);
                    if (content) {
                        _set(found.element, content);
                    }
                }
            }
            _show(found.element);
            if (found.instance.show) {
                found.instance.show(args.params, found.element);
            }
        }


    }

 });
 