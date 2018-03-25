define([], () => {

    const
        helpers = {
            forEach: (obj, template) => obj.map((item, index) => template(item, index)).join(''),
            import: (name) => require(name)
        }

    return {        
        parse: (text, data, name) => {
            if (!data.template) {
                data.template = helpers;
            }            
            data.template.name = name;
            return new Function("return `" + text + "`;").call(data)
        }
    }
});
