define([
    "views/dynamic-data/remote-data-example/data",
    "spa/model"
], (
    fetchData,
    Model
 ) => class {
     
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
    async rendered(params, element) {
        let 
            data = await fetchData(),
            anchorsHtml = Object.keys(data).map(
                item => `<a href="#/remote-data-example/details/${item}">View details for ${item}</a><br />`
            ).join("");

        // rendered event will only be triggered once since this view doesn't allow params
        new Model().bind(element).anchors = anchorsHtml;
    }
    
})
