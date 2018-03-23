define(['module'], module => {
    return {
        version: '1.0.0',
        load: (name, req, onload, config) => 
            req(["text!" + name], text => 
                onload(data => new Function("return `" + text + "`;").call(data)))
    }
});
