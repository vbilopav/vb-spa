define([], () => {

    const 
        isTemplate = name => name.indexOf("template!") !== -1,
        prefix = "_view",
        getId = uriHash => prefix + uriHash,
        types = {template: 1, class: 2, string: 3},
        getViewType = (view, name) => {
            let t = typeof view;
            if (t === "function") {
                if (isTemplate(name)) {
                    return types.template;
                }
                return types.class;
            }
            if (t === "string") {
                return types.string;
            }
            throw new Error("unknown view type " + view);
        },
        showView = item => {
            window.scrollTo(item.x, item.y);
        };

    return {
        getId: getId,
        types: types,
        getViewType: getViewType,
        showView: showView,
        prepareParams: async params => {
            if (params instanceof Promise) {
                return await params
            }
            return params
        }
    }

 });
