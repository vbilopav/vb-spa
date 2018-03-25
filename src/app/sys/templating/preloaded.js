define(["module", "sys/templating/helpers"], (module, helper) => {

    const 
        _search = "{this.template.import(";
        _length = _search.length;
    
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            req(["text!" + name], text => {
                let from = 0, found = [], length = text.length;
                while (from > -1) {
                    let index = text.indexOf(_search, from)
                    if (index === -1) {
                        break;
                    }
                    index = index + _length
                    from = text.indexOf(")", index);
                    if (from !== -1) {
                        let quoted = text.substring(index, from);
                        found.push(quoted.substring(1, quoted.length-1));
                    }
                }
                if (found.length) {
                    require(found, () => onload(data => helper.parse(text, data, name))); 
                } else {                    
                    onload(data => helper.parse(text, data, name));
                }               
            });
        }
    };
});
