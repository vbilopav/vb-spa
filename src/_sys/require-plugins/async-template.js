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
            req(["text!" + name], text => 
                parser.parseImportsAsync(text).then(() => 
                    onload((data, locale) => 
                        parser.parseTemplateAsync(name, text, data, locale))));
        }
        
    };

});
