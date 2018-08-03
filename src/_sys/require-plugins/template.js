define([
    "module", 
    "sys/template-parser"
], (
    _, 
    parse
) => {

    const
        searchImport = "{this.template.import(",
        len = searchImport.length,
        preloaded = ((window._app  && window._app.settings) ? (window._app.settings.usePreloadedTemplates == true) : false); 
    
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            if (preloaded) {
                return req(["text!" + name], text => onload((data, locale) => parse(name, text, data, locale)))
            }
            return req(["text!" + name], text => {
                let from = 0, found = [];
                while (from > -1) {
                    let index = text.indexOf(searchImport, from)
                    if (index === -1) {
                        break;
                    }
                    index = index + len
                    from = text.indexOf(")", index);
                    if (from !== -1) {
                        let quoted = text.substring(index, from);
                        found.push(quoted.substring(1, quoted.length-1));
                    }
                }
                if (found.length) {
                    require(found, () => onload((data, locale) => parse(name, text, data, locale))); 
                } else {
                    onload((data, locale) => parse(name, text, data, locale));
                }
            });
        }
    };

});
