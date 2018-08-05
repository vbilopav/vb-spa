define(["module"], () => {
    
    return {
        version: '1.0.0',
        load(name, req, onload) {
            fetch(name, {mode: "cors"}).then(response => response.text()).then(response => onload(response));
        }
    };

});
