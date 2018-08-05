define([], () => {
    
    window._app.customElements = {
        _tags: {},
        define: (tag, Class, options) => {
            let dashIndex = tag.indexOf("-");
            if (dashIndex === -1 || dashIndex === 0 || dashIndex === tag.length - 1) {
                throw new Error(`tag name "${tag}" malformed, it needs to have dashes inside name.`)
            }
            window._app.customElements[tag] = {
                tag: tag,
                Class: Class,
                options: options
            }
        }
    };

    const
        helpers = {
            forEach: (obj, template) => (
                obj instanceof Array ? obj : Object.entries(obj)
            ).map((item, index) => template(...(item instanceof Array ? item : [item]), index)).join(''),
            import: name => require(name),
            if: (condition, templateTrue, templateFalse) => (condition ? templateTrue : templateFalse)
        },
        parseTemplate = (name, text, data, locale) => {
            data = data || {};
            if (!data.template) {
                data.template = helpers;
            }
            if (locale) {
                data.template = Object.assign(data.template, locale);
            }
            data.template.name = name;
            return new Function("return `" + text + "`;").call(data)
        };
    
    const
        preloaded = ((window._app  && window._app.settings) ? (window._app.settings.usePreloadedTemplates == true) : false),
        searchImport = ".import(",
        searchImportLen = searchImport.length;
    
    const
        parseImports = (text, callback) => {
            if (preloaded) {
                callback();
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
                require(found, () => callback()); 
            } else {
                callback();
            }
        };

    return {
        parseTemplate: parseTemplate,
        parseImports: parseImports
    }
});
