define(["module", "plugins/template-helpers"], (module, helper) => {
    return {
        version: '1.0.0',
        load: (name, req, onload, config) => 
            req(["text!" + name], text => 
                onload(data => helper.template(text, data)))
    }
});
