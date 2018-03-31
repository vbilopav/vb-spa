define([], () => {

    return class {        
        
        render(params) {
            return String.html`
            <div>
                <h3>Model binding support</h3>    
                <p>
                    Demonstration for bi-directional model binding support
                    <br /><br />
                    View location: <pre>/app/views/dynamic-data/model-binding.js</pre>                                
                    <br /><br />
                    <input id="">
                    <hr />
                </p>
            </div>
            `
        }

        rendered(params, element) {
        }
        
    }
    
});