define(["sys/model"], Model => class {
     
    render() { 
        return String.html`
        <div>
            <h3>Master/detail example with fetcing remote data</h3>
            <p>
                List of JavaScript frameworks:
                <br /><hr />
                <span id="anchors"></span>
            <hr />
            </p>
        </div>`
    }
    
    //
    //
    //
    async rendered({element}) {
        let 
            data = await(await fetch("/remote-data-example/frameworks.json", {cache: "no-store"})).json(),
            anchorsHtml = Object.keys(data).map(
                item => `<a href="#/remote-data-example/details/${item}">View details for ${item}</a><br />`
            ).join("");

        // rendered event will only be triggered once since this view doesn't allow params
        new Model().bind(element).anchors = anchorsHtml;
    }
    
})