define([], () => {

    const
        _helpers = {
            forEach: (obj, template) => (
                obj instanceof Array ? obj : Object.entries(obj)
            ).map((item, index) => template(...(item instanceof Array ? item : [item]), index)).join(''),
            import: name => require(name),
            if: (condition, templateTrue, templateFalse) => (condition ? templateTrue : templateFalse)
        },
        _parse = (name, text, data, locale) => {
            data = data || {};
            if (!data.template) {
                data.template = _helpers;
            }
            if (locale) {
                data.template = Object.assign(data.template, locale);
            }
            data.template.name = name;
            return new Function("return `" + text + "`;").call(data)
        };

    var
        _usePreloadedTemplates = ((window._spa  && window._spa.settings) ? (window._spa.settings.usePreloadedTemplates == true) : false); 

    return {
        _usingPreloaded: () => _usePreloadedTemplates,
        _prefixes: ["template!", "cors-template!"],
        parse: _parse,
        usePreloaded: () => {_usePreloadedTemplates = true},
        helpers: _helpers
    }

});
