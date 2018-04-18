define(["spa/template-helpers"], (templateHelper) => {

    const 
        nameStartsWithPrefix = name => {
            for (let p in templateHelper._prefixes) {
                if (name.startsWith(templateHelper._prefixes[p])) {
                    return true;
                }
            }
            return false;
        },
        prefix = "_view",
        getId = (uriHash) => prefix + uriHash,
        types = {template: 1, class: 2, object: 3, string: 4},
        getViewType = (view, name) => {
            let t = typeof view;
            if (t === "function") {
                if (nameStartsWithPrefix(name)) {
                    return types.template;
                }
                return types.class;
            }
            if (t === "object") {
                return types.object;
            }
            if (t === "string") {
                return types.string;
            }
            throw view;
        },
        showView = (item, element) => {
            window.scrollTo(item.x, item.y);
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

        async reveal(args) { //id,view,params,uri
            await new Promise((resolve, reject) => {
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

                    let element = this._container.find("#" + elementId);

                    if (found.type === types.template) {
                        if (!element.length) {
                            element = "span".createElement(elementId).appendTo(this._container);
                        }
                        if (found.uriHash !== uriHash) {
                            element.html(found.instance(args.params));
                            found.uriHash = uriHash;
                        }
                        this._current = element.show();
                        showView(found, element);
                        return resolve(element.id);
                    }

                    if (!element.length) {
                        element = this._container.find("[data-id='" + args.id + "']");
                        if (element.length) {
                            element.id = elementId;
                        }
                    }
                    if (!element.length) {
                        element = "span".createElement(elementId).appendTo(this._container);
                    }

                    if (found.type === types.class || found.type === types.object) {
                        if (found.uriHash !== uriHash) {
                            let newContent;
                            
                            if (found.instance.change) {
                                newContent = found.instance.change(args.params, element);
                            } else if (!found.instance.renderOnce) {
                                newContent = found.instance.render(args.params, element);
                            }

                            if (newContent instanceof Promise) {
                                newContent.then(s => {
                                    element.html(s).show();
                                    if (found.instance.changed) {
                                        found.instance.changed(args.params, element);
                                    } else if (found.instance.rendered) {
                                        found.instance.rendered(args.params, element);
                                    }
                                    this._current = element.show();
                                    showView(found, element);
                                    found.uriHash = uriHash;
                                });
                            } else if (newContent) {
                                element.html(newContent).show();
                                if (found.instance.changed) {
                                    found.instance.changed(args.params, element);
                                } else if (found.instance.rendered) {
                                    found.instance.rendered(args.params, element);
                                }
                                this._current = element.show();
                                showView(found, element);
                                found.uriHash = uriHash;
                            }
                        }
                        return resolve(element.id);
                    }
                    return reject("unknown type");
                }

                let viewName, modules;
                if (typeof args.view === "string") {
                    viewName = args.view;
                    modules = [args.view]
                } else if (typeof args.view === "object") {
                    viewName = args.view.name;
                    if (args.view.inject) {
                        modules = [viewName].concat(args.view.inject)
                    } else {
                        modules = [viewName];
                    }
                }
                if (!viewName || !modules) {
                    throw new Error("View definition incorrect!");
                }

                require(modules, (view, ...injected) => {
                    let type = getViewType(view, viewName),
                        element = "span".createElement(elementId),
                        data = {type: type, uriHash: uriHash, x: 0, y: 0, id: args.id};
                    
                    element.dataset.id = args.id;
                    
                    if (type === types.string) {
                        data.element = element.html(view);
                    } else if (type === types.template) {
                        data.instance = view;
                        element.html(view(args.params, {injected: injected}));
                    } else if (type === types.class) {
                        data.instance = new view(args.id, element, ...injected);
                    } else if (type === types.object) {
                        if (view.init) {
                            view.init(args.id, element, ...injected);
                        }
                        data.instance = view;
                    }
                    
                    if (type === types.object || type === types.class) {
                        let content = data.instance.render(args.params, element);
                        if (content instanceof Promise) {
                            return content.then(s => {
                                element.html(s);
                                !data.instance.rendered || data.instance.rendered(args.params, element);

                                this._views[args.id] = data;
                                this._container.append(element);
                                this._current = element;
                                showView(data, element);
                                return resolve(element.id);
                            });
                        } else if (content) {
                            element.html(content);
                            !data.instance.rendered || data.instance.rendered(args.params, element);

                            this._views[args.id] = data;
                            this._container.append(element);
                            this._current = element;
                            showView(data, element);
                            return resolve(element.id);
                        }
                    } else {
                        this._views[args.id] = data;
                        this._container.append(element);
                        this._current = element;
                        showView(data, element);
                        return resolve(element.id);
                    }
                    
                });
            });  
        }
    }

 });
