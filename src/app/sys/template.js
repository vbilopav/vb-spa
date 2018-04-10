define([
    "module", 
    "sys/template-helpers"
], (
    _, 
    helper
) => {

    const 
        _search = "{this.template.import(",
        _length = _search.length,
        _parse = (name, text, data, locale) => {
            if (!data.template) {
                data.template = helper.helpers;
            }            
            if (locale) {
                data.template = Object.assign(data.template, locale);
            }
            data.template.name = name;
            return new Function("return `" + text + "`;").call(data)
        }
    
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            if (helper._usingPreloaded()) {
                return req(["text!" + name], text => onload((data, locale) => _parse(name, text, data, locale)))
            }
            return req(["text!" + name], text => {
                let from = 0, found = [], length = text.length;
                while (from > -1) {
                    let index = text.indexOf(_search, from)
                    if (index === -1) {
                        break;
                    }
                    index = index + _length
                    from = text.indexOf(")", index);
                    if (from !== -1) {
                        let quoted = text.substring(index, from);
                        found.push(quoted.substring(1, quoted.length-1));
                    }
                }
                if (found.length) {
                    require(found, () => onload((data, locale) => _parse(name, text, data, locale))); 
                } else {                    
                    onload((data, locale) => _parse(name, text, data, locale));
                }               
            });
        }
    };

});
