define([], () => {

     return {

        init: (id, element, template1, module1, module2) => {
            this.template1 = template1;
            this.module1 = module1; 
            this.module2 = module2;
        },

        render: () => String.html`
        <div>
            <h3>Dependency injection - object module</h3>    
            <p>
                Demonstration of dependency injection mechanism into object module
                <br />
                This template, and all injected templates and modules are loaded at the same time asynchronously.
                <br /><br />
                View location: <pre>/app/views/dynamic-data/di/object-module.js</pre>                                
                <br />
                injected template.html: 
                ${this.template1({ 
                    heading: "heading of injected template.html",
                    body: "body of injected template.html",
                })} 
                <br />            
                injected custom-module1: 
                ${this.module1.getHtmlContent( 
                    "heading of injected custom-module1",
                    "body of injected custom-module1",
                )}   
                <hr />
            </p>
        </div>        
        `,

        rendered: () => this.module2.sayHiToConsole()
     }

})