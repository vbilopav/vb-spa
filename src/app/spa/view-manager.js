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
        types = {template: 1, class: 2, string: 3},
        getViewType = (view, name) => {
            let t = typeof view;
            if (t === "function") {
                if (nameStartsWithPrefix(name)) {
                    return types.template;
                }
                return types.class;
            }
            if (t === "string") {
                return types.string;
            }
            throw new Error("unknown view type " + view);
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
            if (args.params instanceof Promise) {
                args.params = await args.params
            }
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

                    if (found.type === types.class) {
                        let showFunc = () => {
                            this._current = element.show();
                            showView(found, element);
                            found.uriHash = uriHash;
                        }
                        if ((found.uriHash !== uriHash || found.instance._options.disableCaching)) {
                            let newContent;

                            if (found.instance.change) {
                                newContent = found.instance.change({params: args.params, element: element});
                            } else if (!found.instance._options.callRenderOnlyOnce) {
                                newContent = found.instance.render({params: args.params, element: element});
                            }

                            let updateFunc = c => {
                                if (c) {
                                    element.html(c).show();
                                }
                                if (found.instance.changed) {
                                    found.instance.changed({params: args.params, element: element});
                                } else if (found.instance.rendered) {
                                    found.instance.rendered({params: args.params, element: element});
                                }
                                showFunc();
                            }

                            if (newContent instanceof Promise) {
                                return newContent.then(s => {
                                    updateFunc(s);
                                    return resolve(element.id);
                                });
                            } else {
                                updateFunc(newContent);
                                return resolve(element.id);
                            }
                        } else {
                            showFunc();
                            return resolve(element.id);
                        }
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
                        let options = {
                            disableCaching: false,
                            callRenderOnlyOnce: false
                        };
                        data.instance = new view({id: args.id, element: element, options: options}, ...injected);
                        data.instance._options = options;
                    }

                    let resolveFunc = () => {
                        this._views[args.id] = data;
                        this._container.append(element);
                        this._current = element;
                        showView(data, element);
                        return resolve(element.id);
                    }

                    let contentFunc = c => {
                        if (c) {
                            element.html(c);
                        }
                        !data.instance.rendered || data.instance.rendered({params: args.params, element: element});
                    }
                    
                    if (type === types.class) {
                        let content = data.instance.render({params: args.params, element: element});
                        if (content instanceof Promise) {
                            return content.then(s => {
                                contentFunc(s);
                                return resolveFunc();
                            });
                        } else {
                            contentFunc(content);
                            return resolveFunc();
                        }
                    } else {
                        return resolveFunc();
                    }

                });
            });  
        }
    }

 });
