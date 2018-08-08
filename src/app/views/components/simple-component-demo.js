define(["sys/template-parser"], parser => class {

    render() {
        return parser.parseAsync(() => String.html`
            <div class="">
                <h3>Simple component demonstration</h3>
                <p>
                    You can use class views as components, not just views.
                    <br /><br />
                    View location: 
                    <pre>/app/views/components/simple-component.js</pre>
                    <br />
                    Rendered component:
                    <hr />
                    ${new (this.template.import("views/components/simple-component"))().render()}
                </p>
            </div>`
        )
    }
});