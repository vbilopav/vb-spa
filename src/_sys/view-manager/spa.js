define(["sys/view-manager/utils"], utils => class {

    constructor(
        container=(()=>{throw container})()
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
                elementId = utils.getId(uriHash);

            if (this._current) {
                this._current.hide();
            }

            if (found) {

                if (found.type === utils.types.string) {
                    this._current = found.element.show();
                    utils.showView(found, found.element);
                    return resolve(found.element.id);
                }

                let element = this._container.find("#" + elementId);

                if (found.type === utils.types.template) {
                    if (!element.length) {
                        element = "span".createElement(elementId).appendTo(this._container);
                    }
                    if (found.uriHash !== uriHash) {
                        let result = found.instance(args.params);
                        if (typeof result === "string") {
                            element.html(result);
                            args.params.___rendered(element);
                        } else if (result instanceof HTMLElement) {
                            element.html("").append(result);
                            args.params.___rendered(element);
                        } else if (result instanceof Promise) {
                            result.then(r => {
                                if (typeof r === "string") {
                                    element.html(r);
                                } else {
                                    element.html("").append(r);
                                }
                                args.params.___rendered(element);
                            });
                        }
                    }
                    this._current = element.show();
                    utils.showView(found, element);
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

                if (found.type === utils.types.class) {
                    let showFunc = () => {
                        this._current = element.show();
                        utils.showView(found, element);
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
                            if (typeof c === "function" || c instanceof Array) {
                                c = _app.parse(...c);
                                c.then(s => {
                                    if (typeof s === "string") {
                                        element.html(s).show();
                                    } else {
                                        element.html("").append(s).show();
                                    }
                                    if (found.instance.changed) {
                                        found.instance.changed({params: args.params, element: element});
                                    } else if (found.instance.rendered) {
                                        found.instance.rendered({params: args.params, element: element});
                                    }
                                    showFunc();
                                })
                            } else if (typeof c === "string" || c instanceof HTMLElement) {
                                if (typeof c === "string") {
                                    element.html(c).show();
                                } else {
                                    element.html("").append(c).show();
                                }
                                if (found.instance.changed) {
                                    found.instance.changed({params: args.params, element: element});
                                } else if (found.instance.rendered) {
                                    found.instance.rendered({params: args.params, element: element});
                                }
                                showFunc();
                            }
                        }

                        if (typeof newContent === "function") {
                            newContent = _app.parse(newContent);
                        }
                        if (newContent instanceof Array) {
                            newContent = _app.parse(...newContent);
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
                let type = utils.getViewType(view, viewName),
                    element = "span".createElement(elementId),
                    data = {type: type, uriHash: uriHash, x: 0, y: 0, id: args.id};
                
                element.dataset.id = args.id;
                
                if (type === utils.types.string) {
                    data.element = element.html(view);
                } else if (type === utils.types.template) {
                    data.instance = view;
                    let result = view(args.params, {injected: injected});
                    if (typeof result === "string") {
                        element.html(result);
                        args.params.___rendered(element);
                    } else if (result instanceof HTMLElement) {
                        element.html("").append(result);
                        args.params.___rendered(element);
                    } else if (result instanceof Promise) {
                        result.then(r => {
                            if (typeof r === "string") {
                                element.html(r);
                            } else {
                                element.html("").append(r);
                            }
                            args.params.___rendered(element);
                        });
                    }
                    
                } else if (type === utils.types.class) {
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
                    utils.showView(data, element);
                    return resolve(element.id);
                }

                let contentFunc = c => {
                    if (typeof c === "function" || c instanceof Array) {
                        c = _app.parse(...c);
                        c.then(s => {
                            if (typeof s === "string") {
                                element.html(s);
                            } else {
                                element.html("").append(s);
                            }
                            !data.instance.rendered || data.instance.rendered({params: args.params, element: element});
                        })
                    } else if (typeof c === "string" || c instanceof HTMLElement) {
                        if (typeof c === "string") {
                            element.html(c);
                        } else {
                            element.html("").append(c);
                        }
                        !data.instance.rendered || data.instance.rendered({params: args.params, element: element});
                    }
                }

                if (type === utils.types.class) {
                    let content = data.instance.render({params: args.params, element: element});
                    if (typeof content === "function" || content instanceof Array) {
                        content = _app.parse(...content);
                    }
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
 });
