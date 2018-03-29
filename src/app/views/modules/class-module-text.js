define([], () => class {        
    constructor(id) {
        // constructor is optional, it receives only id
        console.log(id + " created");
    }
    render(...params) {
        return "bla"
    }
});