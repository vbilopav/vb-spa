define([
    "module", 
    "sys/template-parser"
], (
    _,
    parser
) => {
    
    return {
        version: '1.0.0',
        load(name, req, onload) {
            fetch(name, {mode: "cors"}).then(
                response => response.text()
            ).then(
                response => 
                    parser.parseImports(response, () => 
                        onload((data, locale) => 
                            parser.parseTemplate(name, response, data, locale)))
            );
        }
    };

});
