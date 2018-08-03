define([], () => {

    const
        helpers = {
            forEach: (obj, template) => (
                obj instanceof Array ? obj : Object.entries(obj)
            ).map((item, index) => template(...(item instanceof Array ? item : [item]), index)).join(''),
            import: name => require(name),
            if: (condition, templateTrue, templateFalse) => (condition ? templateTrue : templateFalse)
        };

    return (name, text, data, locale) => {
        data = data || {};
        if (!data.template) {
            data.template = helpers;
        }
        if (locale) {
            data.template = Object.assign(data.template, locale);
        }
        data.template.name = name;
        return new Function("return `" + text + "`;").call(data)
    }
});
