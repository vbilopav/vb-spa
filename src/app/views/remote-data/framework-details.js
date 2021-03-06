define([], () => class {
     
    render({params}) {
        let name = params;
        return String.html`
        <style>
            .framowrk-label {
                font-weight: bold;
                width: 100px;
            }
        </style>
        <div>
        <h3>Details for <span id="name">${name}</span></h3>
            <hr />
            <p>
                <div>
                    <span class="framowrk-label">Web: </span>
                    <a target="_blank" id="Web"></a>
                </div>
                <hr />
                <div>
                    <span class="framowrk-label">Description: </span>
                    <span id="Description"></span>
                </div>
                <hr />
                <div>
                    <span class="framowrk-label">Initial release: </span>
                    <span id="InitialRelease"></span>
                </div>
                <hr />
                <div>
                    <span class="framowrk-label">Stable release: </span>
                    <span id="StableRelease"></span>
                </div>
                <hr />
                <div>
                    <span class="framowrk-label">Written in: </span>
                    <span id="WrittenIn"></span>
                </div>
                <hr />
                <div>
                    <span class="framowrk-label">Developed by: </span>
                    <span id="DevelopedBy"></span>
                </div>
                <hr />
                <div>
                    <span class="framowrk-label">Remarks: </span>
                    <span id="Remarks"></span>
                </div>
                <hr />
                <button onclick="window.history.back();">Go back</button>
            </p>
        </div>`
    }

    rendered({params, element}) {
        this.model = new _app.Model().bind(element);
        this.changed({params});
    }

    async changed({params}) {
        let name = params,
            data = await(await fetch("/remote-data-example/frameworks.json")).json(),
            item = data[name];
        if (item) {
            this.model.name = name;
            Object.assign(this.model, item);
        } else {
            Object.assign(this.model, {
                name: name,
                Web: "n/a",
                Description: "n/a",
                InitialRelease: "n/a",
                StableRelease: "n/a",
                WrittenIn: "n/a",
                DevelopedBy: "n/a",
                Remarks: "n/a" 
            });
        }
    }

    //
    // We want render to be called only once and to remember the model. 
    // Model is reassigned with new data on changed event.
    // We leave this empty to ensure that view is rendered only once
    //
    change() { }

})
