define(["module"], _ => {
    
    return {
        version: '1.0.0',
        load(name, req, onload, config) {
            fetch(name).then(response => response.text()).then(response => onload(response));
        }
    };

});
