define([], () => {

    const
        _helpers = {
            forEach: (obj, template) => obj.map((item, index) => template(item, index)).join(''),
            import: (name) => require(name)
        };
    
    var
        _usePreloaded = false;

    return {        
        _usingPreloaded: () => _usePreloaded,
        _prefix: "template!",
        usePreloaded: () =>  {_usePreloaded = true},        
        helpers: _helpers,
        add(globalHelpers=(() => {throw globalHelpers})()) {
            for (let item in globalHelpers) {
                helpers[item] = globalHelpers[item];
            }
            return this;
        }        
    }
    
});
