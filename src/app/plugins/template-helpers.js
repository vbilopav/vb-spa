define([], () => {

    window.template = {
        forEach: (obj, template) => obj.map((item, index) => template(item, index)).join('')        
    }
    
    return {
        template: (text, data) => new Function("return `" + text + "`;").call(data)
    }    
});
