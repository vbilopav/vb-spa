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
            return req(["text!" + name], text => 
                parser.parseImports(text, () => 
                    onload((data, locale) => 
                        parser.parseTemplate(name, text, data, locale))));
        }
    };

});
