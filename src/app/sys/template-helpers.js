define([], () => {

    const
        _helpers = {
            forEach: (obj, template) => obj.map((item, index) => template(item, index)).join(''),
            import: name => require(name),
            if: (condition, templateTrue, templateFalse) => (condition ? templateTrue : templateFalse)
        };

    var 
        _usePreloadedTemplates = ((window._spa  && window._spa.settings) ? (window._spa.settings.usePreloadedTemplates == true) : false); 
       
    return {        
        _usingPreloaded: () => _usePreloadedTemplates,
        _prefix: "template!",
        usePreloaded: () =>  {_usePreloadedTemplates = true},        
        helpers: _helpers
        //add global template helpers method here              
    }
    
});
