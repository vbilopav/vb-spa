define([], () => {

     return {

        init: ({}, template1, module1, module2) => {
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
                This object module, and all injected templates and modules are loaded at the same time asynchronously.
                <br /><br />
                View location: <pre>/app/views/dynamic-data/di/object-module.js</pre>
                <br />
                injected template.html: 
                ${this.template1({ 
                    heading: "heading of injected injected/template.html to object-module",
                    body: "body of injected injected/template.html to object-module",
                })} 
                <br />
                injected custom-module1:
                ${this.module1.getHtmlContent(
                    "heading of injected injected/custom-module1 to object-module",
                    "body of injected injected/custom-module1 to object-module",
                )}
                <hr />
            </p>
        </div>
        `,

        rendered: () => this.module2.sayHiToConsole()
     }

})