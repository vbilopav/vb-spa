/*
The MIT License (MIT)
Copyright (c) 2018 Vedran Bilopavlović
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(["sys/template-helpers"], (templateHelper) => {

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

        reveal(args) { //id,view,params,uri
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
                            } else {
                                if (!found.instance.renderOnceIfChangeNotPresent) {
                                    newContent = found.instance.render(args.params, element);
                                }
                            }
                            if (newContent) {
                                element.html(newContent);
                            }
                            element.show();
                            if (found.instance.changed) {
                                found.instance.changed(args.params, element);
                            } else {
                                if (found.instance.rendered) {
                                    found.instance.rendered(args.params, element);
                                }
                            }
                            found.uriHash = uriHash;
                        }  
                        this._current = element.show();
                        showView(found, element);
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
                        if (content) {
                            element.html(content);
                        }
                        !data.instance.rendered || data.instance.rendered(args.params, element);
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
