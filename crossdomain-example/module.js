define(["template!views/modules/new-bundle/template.html"], template => class {
     
    render() { 
        return `
        <div class="">
        <h3>This is a remote module!</h3>    
        <p>
            Hi from module from another domain!!!
        </p>
        </div>        
    `
    }
});
