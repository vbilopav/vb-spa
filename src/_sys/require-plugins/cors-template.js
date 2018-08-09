define([
    "module", "sys/template/parser", "sys/template/import"
], (
    _, parser, importParser
) => {
    
    return {
        version: '1.0.0',
        load(name, req, onload) {
            fetch(name, {mode: "cors"}).then(
                response => response.text()
            ).then(
                response => 
                    importParser.parseImportsAsync(response).then(() => onload((data, locale) => parser.parseTemplate(text, data, locale, name)))
            );
        }
    };

});
