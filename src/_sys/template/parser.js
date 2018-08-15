define(["sys/template/helpers", "sys/template/import"], (helpers, importParser) => {

    _app.template = (pieces, ...subs) => {
        let promises = [];
        for(let i = 0, l = subs.length; i < l; i++) {
            let sub = subs[i];
            if (typeof sub === "function") {
                let result = sub();
                sub = result === undefined || typeof result === "function" ? "" : result;
                subs[i] = sub;
            }
            if (sub instanceof Promise) {
                promises.push({index: i, sub: sub});
            }
            if (sub === undefined) {
                subs[i] = "";
            }
        }
        if (!promises.length) {
            return String.raw(pieces, ...subs);
        }
        return (async () => {
            for(let i = 0, l = promises.length; i < l; i++) {
                let promise = promises[i],
                    sub = await promise.sub;
                if (typeof sub === "function") {
                    let result = sub();
                    if (result instanceof Promise) {
                        result = await result;
                    }
                    sub = result === undefined || typeof result === "function" ? "" : result;
                }
                subs[promise.index] = sub;
            }
            return String.raw(pieces, ...subs);
        })();
    };

    _app.composite = (_, ...subs) => subs;

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
            data.___rendered = element => !data.template.rendered || data.template.rendered(element);
            return data;
        },
        parseTemplate = (text, data, locale, name) => 
            new Function("return _app.template`" + text + "`;").call(prepareTemplate(data, name, locale)),
        parseComposite = (text, data, locale, name) => 
            new Function("return _app.composite`" + text + "`;").call(prepareTemplate(data, name, locale));

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
        return await parseTemplate(text, data, locale, name);
    };

    return {
        parseTemplate: parseTemplate,
        parseComposite: parseComposite,
    }
});
