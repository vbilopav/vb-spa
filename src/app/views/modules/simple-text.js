define([], () => `
    <div class="">
    <h3>This is a plain-text view rendered from module</h3>    
    <p>
        View content could be inside module (like in this example) or it could be imported from another module or template or whatever.
        <br />
        Not particularly useful though, but it can be done...
        <br /><br />
        View location: 
        <pre>/app/views/modules/simple-text.html</pre>
        <br />
        Full route definition: 

<pre>
"/module-simple-text": {
    view: "views/modules/simple-text",
    data: {
        title: "Simple text from module",
        category: "modules"
    }
}</pre>

        <br />
        Nothing is going around here.
        <br /><br />
        <hr />
    </p>
</div>
`);