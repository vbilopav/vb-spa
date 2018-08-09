define(["sys/template/helpers", "sys/template/import"], (helpers, importParser) => {

    _app.templateAsync = (pieces, ...subs) => {
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

    _app.template = (pieces, ...subs) => {
        for(let i = 0, l = subs.length; i < l; i++) {
            let sub = subs[i];
            if (typeof sub === "function") {
                let result = sub();
                subs[i] = result === undefined ? "" : result;
            }
        }
        return String.raw(pieces, ...subs);
    };

    _app.compositeAsync = (pieces, ...subs) => {
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
            return subs;
        }
    };

    _app.composite = (pieces, ...subs) => {
        for(let i = 0, l = subs.length; i < l; i++) {
            let sub = subs[i];
            if (typeof sub === "function") {
                let result = sub();
                subs[i] = result === undefined ? "" : result;
            }
        }
        return subs;
    };

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
        parseTemplate = (templateFunc, text, data, locale, name) => 
            new Function("return _app." + templateFunc + "`" + text + "`;").call(prepareTemplate(data, name, locale)),
        parseTemplateAsync = async (templateFunc, text, data, locale, name) => 
            new Function("return _app." + templateFunc + "`" + text + "`;").call(prepareTemplate(data, name, locale))();

    _app.parse = async (template, data, locale, name) => {
        let text;
        if (typeof template === "string") {
            text = template;
        } else {
            text = template.toString();
            let index = text.indexOf("`", 0);
            if (index === -1) {
                throw new Error("Invalid template");
            }
            text =  text.substring(index+1, text.indexOf("`", index+1));
        }
        await importParser.parseImportsAsync(text);
        return await parseTemplateAsync(text, data, locale, name)
    };

    return {
        parseTemplate: (text, data, locale, name) => parseTemplate("template", text, data, locale, name),
        parseTemplateAsync: (text, data, locale, name) => parseTemplateAsync("templateAsync", text, data, locale, name),
        parseComposite: (text, data, locale, name) => parseTemplate("composite", text, data, locale, name),
        parseCompositeAsync: (text, data, locale, name) => parseTemplateAsync("compositeAsync", text, data, locale, name),
    }
});
