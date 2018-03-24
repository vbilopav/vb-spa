define([], () => {
    window._iterable = (obj) => {
        obj.forEachTemplate =  function (template) {
            return this.map((item, index) => template(item, index)).join('')
        }
        return obj;
    }

    return {
        template: (text, data) => new Function("return `" + text + "`;").call(data)
    }    
});
