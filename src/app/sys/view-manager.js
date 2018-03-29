define(["sys/template-helpers"], (templateHelper) => {

    const 
        templatePrefix = templateHelper._prefix,
        prefix = "_view",
        getId = (uriHash) => prefix + uriHash,
        types = {template: 1, class: 2, object: 3, string: 4},
        getViewType = (view, name) => {
            let t = typeof view;
            if (t === "function") {
                if (name.startsWith(templatePrefix)) {
                    return types.template;
                }                
                return types.class;
            }
            if (t === "object") {
                return types.object;
            }
            return types.string;
        },      
        showView = (item, element) => {
            window.scrollTo(item.x, item.y);
            element.dataset.timestamp = Date.now()
        };

    return class {    
        constructor(
            container=(() => {throw container})()
        ) {
            this._container = container;
            this._views = {} //id,uri,type,instance
            this._current;
        }

        leave(viewId, elementId) {
            if (viewId === undefined) {
                return this;
            }
            let view = this._views[viewId];
            if (!view) {
                return this;
            }
            view.x = window.pageXOffset;
            view.y = window.pageYOffset;
            return this;
        }

        reveal(args) { //id,name,params,uri
            return new Promise((resolve, reject) => {
                let found = this._views[args.id],
                    uriHash = args.uri.hashCode(),
                    elementId = getId(uriHash);

                if (this._current) {
                    this._current.hide();
                }

                if (found) {
                    
                    if (found.type === types.string) {
                        this._current = found.element.show();
                        showView(found, found.element);
                        return resolve(found.element.id);    
                    }    
                    
                    let element = this._container.find("#" + elementId),
                        empty = false;
                    if (!element.found) {      
                        element = "span".createElement(elementId).appendTo(this._container);
                        empty = true;                       
                    }

                    if (found.type === types.template) {
                        if (found.uriHash !== uriHash) {
                            element.html(found.instance(args.params));
                            found.uriHash = uriHash;
                        }
                        this._current = element.show();
                        showView(found, element);
                        return resolve(element.id);                        
                    }

                    if (found.type === types.class || found.type === types.object) {
                        if (found.uriHash !== uriHash) {
                            let newContent = found.instance.change(args.params, element);
                            if (newContent) {
                                element.html(newContent)
                            }
                            found.uriHash = uriHash;
                        }  
                        this._current = element.show();
                        showView(found, element);
                        return resolve(element.id);
                    }
                    return reject("unknown type");
                }
                
                require([args.name], view => {
                    let type = getViewType(view, args.name),
                        element = "span".createElement(elementId),
                        data = {type: type, uriHash: uriHash, x: 0, y: 0};
                    if (type === types.string) {          
                        data.element = element.html(view);
                    } else if (type === types.template) {
                        data.instance = view;
                        element.html(view(args.params));
                    } else if (type === types.class) {
                        data.instance = new view(args.id);
                        let content = data.instance.render(args.params, data.element);
                        if (content) {
                            element.html(content);
                        }
                    } else if (type === types.object) {
                        view.init(args.id);
                        data.instance = view;
                        let content = data.instance.render(args.params, data.element);
                        if (content) {
                            element.html(content);
                        }
                    }

                    this._views[args.id] = data;
                    this._container.append(element);
                    this._current = element;
                    showView(data, element);
                    return resolve(element.id);
                });
            });  
        }
    }

 });
 