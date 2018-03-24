define([], () => {

    const
        helpers = {
            forEach: (obj, template) => obj.map((item, index) => template(item, index)).join('')
        }

    return {
        parse: (text, data, name) => {
            if (!data.template) {
                data._template = helpers;
            }            
            data.template.name = name;
            return new Function("return `" + text + "`;").call(data)
        }
    }
});
