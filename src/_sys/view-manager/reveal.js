define(["sys/view-manager/utils"], utils => ({
    id="", 
    view=(()=>{throw view})(), 
    params={}, 
    uri="", 
    elementOrId=(()=>{throw elementOrId})()
}) => new Promise(resolve => {

    let viewName, modules;
    if (typeof view === "string") {
        viewName = view;
        modules = [view]
    } else if (typeof view === "object") {
        viewName = view.name;
        if (view.inject) {
            modules = [viewName].concat(view.inject)
        } else {
            modules = [viewName];
        }
    }
    if (!viewName || !modules) {
        throw new Error("View definition incorrect!");
    }
    
    require(modules, (view, ...injected) => {
        let uriHash = uri;
        let type = utils.getViewType(view, viewName),
            element = (typeof elementOrId === "string" ? "span".createElement(elementOrId) : elementOrId),
            data = {type: type, uriHash: uriHash, x: 0, y: 0, id: id};
        if (id) {
            element.dataset.id = id;
        }
        
        if (type === utils.types.string) {

            data.element = element.html(view);

        } else if (type === utils.types.template) {

            data.instance = view;
            let result = view(params, {injected: injected});

            if (typeof result === "string") {

                element.html(result);
                params.___rendered(element);

            } else if (result instanceof HTMLElement) {

                element.html("").append(result);
                params.___rendered(element);

            } else if (result instanceof Promise) {

                result.then(r => {
                    
                    if (typeof r === "string") {
                        element.html(r);
                    } else {
                        element.html("").append(r);
                    }
                    params.___rendered(element);

                });
            }
            
        } else if (type === utils.types.class) {
            let options = {
                disableCaching: false,
                callRenderOnlyOnce: false
            };
            data.instance = new view({id: id, element: element, options: options}, ...injected);
            data.instance._options = options;
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
                    !data.instance.rendered || data.instance.rendered({params: params, element: element});
                })
            } else if (typeof c === "string" || c instanceof HTMLElement) {
                if (typeof c === "string") {
                    element.html(c);
                } else {
                    element.html("").append(c);
                }
                !data.instance.rendered || data.instance.rendered({params: params, element: element});
            }
        }

        if (type === utils.types.class) {
            let content = data.instance.render({params: params, element: element});
            if (typeof content === "function" || content instanceof Array) {
                content = _app.parse(...content);
            }
            if (content instanceof Promise) {
                return content.then(s => {
                    contentFunc(s);
                    return resolve({data, element});
                });
            } else {
                contentFunc(content);
                return resolve({data, element});
            }
        } else {
            return resolve({data, element});
        }

    });

}));
