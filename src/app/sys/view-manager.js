define(["sys/template-helpers"], t => { 

    const 
        _templatePrefix = t._prefix,
        _prefix = "_view-",
        _id = (id, uriHash) => _prefix + id + uriHash,
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
        },
        _hashCode = (s) => {
            let h = 0;
            for (var i = 0; i < s.length; i++) {
                let c = s.charCodeAt(i);
                h = ((h<<5)-h)+c;
                h = h & h;
            }
            return h;
        },
        _q = (e, s) => _app.e(e).q(s),
        _show = e => _app.e(e).show(s), 
        _hide = e => _app.e(e).hide(s), 
        _set = (e, s) => _app.e(e).set(s),
        _create = (s) => document.createElement(s);

    return class {    
        constructor(
            container=(() => {throw container})()
        ) {
            this._container = container;
            this._views = {} //id,uri,type,instance
        }

        reveal(args) { //id,name,params,uri
            return new Promise((resolve, reject) => {
                let found,
                    uriHash = _hashCode(args.uri),
                    elementId = _prefix + args.id + uriHash;

                for (let id in this._views) {
                    let view = this._views[id];
                    if (id === args.id) {
                        found = view;
                    }
                    _hide(view.element);
                }

                if (found) {

                    if (found.type === _type.string) {
                        _show(found.element);
                        return resolve();    
                    }    
                    
                    let element = _q(this._container, "#" + _id(elementId, uriHash)),
                        empty = false;
                    if (!element) {                        
                        element = _create("span")
                        element.id = _id(elementId, uriHash);
                        this._container.append(element);
                        empty = true;
                    }

                    if (found.type === _type.template) {
                        
                        if (uriHash !== found.uriHash) {
                            found.uriHash = uriHash;
                            _set(found.element, found.instance(args.params));
                        }
                        _show(found.element);
                        return resolve();
                    }

                    if (found.type === _type.class || found.type === _type.object) {
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
                    type = _getViewType(view, args.name), 
                    data = {
                        type: type, 
                        element: document.createElement("span"),
                        uriHash: _hashCode(args.uri)
                    };
                data.element.id = _prefix + args.id;
                _hide(data.element);

                if (type === _type.string) {
                    _set(data.element, view);                    
                }

                else if (type === _type.template) {
                    data.instance = view;
                    _set(data.element, view(args.params));
                }

                else if (type === _type.class) {
                    data.instance = new view(args.id);
                    let content = view.create(args.params, data.element);
                    if (content) {
                        _set(data.element, content);
                    }
                }

                else if (type === _type.object) {
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
                if (type === _type.class || type === _type.object) {
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
 