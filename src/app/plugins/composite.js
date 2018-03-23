define(['module'], module => {
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            req(["text!" + name], text => {
                let from = 0,
                    found = [],
                    length = text.length,
                    search = "{require(\"",
                    searchLength = search.length;
                while (from > -1) {
                    let index = text.indexOf(search, from)
                    if (index === -1) {
                        break;
                    }
                    index = index + searchLength
                    from = text.indexOf("\")", index);
                    if (from !== -1) {
                        found.push(text.substring(index, from))
                    } else {
                        throw Error("Error: require statement in template incorrect!");
                    }
                }
                if (found.length) {
                    require(found, () => onload(data => new Function("return `" + text + "`;").call(data))); 
                } else {                    
                    onload(data => new Function("return `" + text + "`;").call(data));
                }               
            });
        }
    };
});
