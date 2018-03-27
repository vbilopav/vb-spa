define([], () => {

    const
        _helpers = {
            forEach: (obj, template) => obj.map((item, index) => template(item, index)).join(''),
            import: (name) => require(name)
        };

    return {        
        _usingPreloaded: () => _app.settings.usePreloadedTemplates == true,
        _prefix: "template!",
        usePreloaded: () =>  {_app.settings.usePreloadedTemplates = true},        
        helpers: _helpers,
        add(globalHelpers=(() => {throw globalHelpers})()) {
            _helpers = Object.assign(_helpers, globalHelpers);
            return this;
        }        
    }
    
});
