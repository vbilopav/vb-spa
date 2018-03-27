define(["sys/template-helpers"], (templateHelper) => {

    const 
        templatePrefix = templateHelper._prefix,
        prefix = "_view-",
        getId = (id, uriHash) => prefix + id + uriHash,
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
        hashCode = (s) => {
            let h = 0;
            for (let i = 0, len = s.length; i < len; i++) {
                let c = s.charCodeAt(i);
                h = ((h<<5)-h)+c;
                h = h & h;
            }
            return h;
        },
        adjustWindow = (view) => window.scrollTo(view. x, view.y);         

    return class {    
        constructor(
            container=(() => {throw container})(),
            notFoundView
        ) {
            this._container = container;
            this._views = {} //id,uri,type,instance
            this._current;
        }

        leave(id) {
            let data = this._views[id]; 
            if (!data) {
                return
            }
            data.x = window.pageXOffset;
            data.y = window.pageYOffset;
        }

        reveal(args) { //id,name,params,uri
            return new Promise((resolve, reject) => {
                let found = this._views[args.id],
                    uriHash = hashCode(args.uri),
                    elementId = getId(args.id, uriHash);

                if (this._current) {
                    this._current.hide();
                }

                if (found) {
                    
                    if (found.type === types.string) {
                        this._current = found.element.show();
                        adjustWindow(found);                        
                        return resolve();    
                    }    
                    
                    let element = this._container.q("#" + elementId),
                        empty = false;
                    if (!element) {      
                        element = "span".createElement(elementId).appendTo(this._container);
                        empty = true;
                        console.warn(`view element id=${elementId} missing from dom!`);
                    }

                    if (found.type === types.template) {
                        if (found.uriHash !== uriHash) {
                            element.html(found.instance(args.params));
                            found.uriHash = uriHash;
                        }
                        this._current = element.show();
                        adjustWindow(found);
                        return resolve();                        
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
                        adjustWindow(found);
                        return resolve();
                    }
                    return reject("unknown type");
                }
                
                require([args.name], view => {
                    let type = getViewType(view, args.name),                         
                        element = "span".createElement(elementId),
                        data = {
                            type: type, 
                            uriHash: uriHash,
                            x: 0,
                            y: 0
                        };

                    if (type === types.string) {          
                        data.element = element.html(view);                                                
                    } else if (type === types.template) {
                        data.instance = view;
                        element.html(view(args.params));  
                    } else if (type === types.class) {
                        data.instance = new view(args.id);
                        let content = view.render(args.params, data.element);
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
                    adjustWindow(data);
                    return resolve();
                });
            });  
        }
    }

 });
 