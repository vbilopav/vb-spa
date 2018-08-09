define([
    "module", "sys/template/parser", "sys/template/import"
], (
    _, parser, importParser
) => {

    return {
        version: '1.0.0',
        load(name, req, onload) {
            req(["text!" + name], text => 
            importParser.parseImportsAsync(text).then(() => 
                    onload((data, locale) => parser.parseCompositeAsync(text, data, locale, name))));
        }
        
    };

});
