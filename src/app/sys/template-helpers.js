define([], () => {

    const
        helpers = {
            forEach: (obj, template) => obj.map((item, index) => template(item, index)).join(''),
            import: (name) => require(name)
        };
    
    var
        _usePreloaded = false;

    return {        
        _usingPreloaded: () => _usePreloaded,
        usePreloaded: () =>  {_usePreloaded = true},        
        helpers: helpers,
        add(globalHelpers) {
            for (let item in globalHelpers) {
                helpers[item] = globalHelpers[item];
            }
            return this;
        }
    }
});
