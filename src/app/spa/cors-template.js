define([
    "module", 
    "spa/template-helpers"
], (
    _,
    helper
) => {
    
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            fetch(name, {mode: "cors"}).then(response => response.text()).then(response => {
                onload((data, locale) => helper.parse(name, response, data, locale))
            })
        }
    };

});
