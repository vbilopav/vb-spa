define(["sys/template-helpers", "sys/test-prototype"], (helpers, test) => {

    test(String, ["_async"]);

    String._async = (pieces, ...subs) => {
        return async () => {
            for(let i = 0, l = subs.length; i < l; i++) {
                let sub = subs[i];
                if (sub instanceof Promise) {
                    subs[i] = await sub;
                }
                if (typeof sub === "function") {
                    let result = sub();
                    if (result instanceof Promise) {
                        result = await result;
                    }
                    subs[i] = result === undefined ? "" : result;
                }
            }
            return String.raw(pieces, ...subs);
        }
    };

    test(String, ["_template"]);

    String._template = (pieces, ...subs) => {
        for(let i = 0, l = subs.length; i < l; i++) {
            let sub = subs[i];
            if (typeof sub === "function") {
                let result = sub();
                subs[i] = result === undefined ? "" : result;
            }
        }
        return String.raw(pieces, ...subs);
    }


    const
        preloaded = ((window._app  && window._app.settings) ? (window._app.settings.usePreloadedTemplates == true) : false),
        searchImport = ".import(",
        searchImportLen = searchImport.length,
        parseImportsAsync = async text => await new Promise(resolve => {
            if (preloaded) {
                resolve();
            }
            let from = 0, found = [];
            while (from > -1) {
                let index = text.indexOf(searchImport, from)
                if (index === -1) {
                    break;
                }
                index = index + searchImportLen
                from = text.indexOf(")", index);
                if (from !== -1) {
                    found = found.concat(eval("[" + text.substring(index, from) + "]"))
                }
            }
            if (found.length) {
                require(found, () => resolve()); 
            } else {
                resolve();
            }
        });

    const
        prepareTemplate = (data, name, locale) => {
            data = data || {};
            if (!data.template) {
                data.template = helpers;
            }
            if (locale) {
                data.template = Object.assign(data.template, locale);
            }
            data.template.name = name;
            return data;
        },
        parseTemplate = (name, text, data, locale) => 
            new Function("return String._template`" + text + "`;").call(prepareTemplate(data, name, locale)),
        parseTemplateAsync = async (name, text, data, locale) => 
            new Function("return String._async`" + text + "`;").call(prepareTemplate(data, name, locale))();

    return {
        parseTemplate: parseTemplate,
        parseTemplateAsync: parseTemplateAsync,
        parseImportsAsync: parseImportsAsync,
    }
});
