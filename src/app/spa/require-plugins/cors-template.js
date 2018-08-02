define([
    "module", 
    "spa/template-parser"
], (
    _,
    parse
) => {
    
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            fetch(name, {mode: "cors"}).then(response => response.text()).then(response => {
                onload((data, locale) => parse(name, response, data, locale))
            })
        }
    };

});
