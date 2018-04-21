define(["spa/model"], Model => {

    const
        model = new Model({
            name: "name", // when value is string bind will match name or id
            email: e => e.name === "email", // value can be function to test element
            select: e => e.matches("[name=select]"), // so that selector can also be used
            check: "check_id",
            showButton: "showButton"
        }),
        module = {
            render: () => String.html`
            <div>
                <h3>Model binding support - programmatic</h3>
                <p>
                    Demonstration for programmatic bi-directional model binding support
                    <br /><br />
                    View location: <pre>/app/views/dynamic-data/model-binding/programmatic.js</pre>
                    <br />
                    <span id="model-area">
                        <label for="name" style="width: 50px">Name: </label><input name="name" type="text"><br />
                        <label for="email" style="width: 50px">Email: </label><input name="email" type="email"><br />
                        <label for="frameworks">Frameworks: </label>
                        <select name="select">
                            <option value="">select framework ...</option>
                            <option value="Ember">Ember</option>
                            <option value="Angular2">Angular2</option>
                            <option value="Angular">AngularJS</option>
                            <option value="Vue">Vue</option>
                            <option value="Inferno">Inferno</option>
                            <option value="Preact">Preact</option>
                            <option value="React">React</option>
                        </select>
                        <br />
                        <input type="checkbox" name="check" id="check_id" checked>&nbsp;&nbsp;Yes, I might not need those frameworks!<br />
                        <br />
                        <button name="showButton" onclick="showButtonClick">Check model state in console output</button>
                    </span>
                    <hr />
                    <button id="btn-set-name">Set new value for "name" model propery</button><br /><br />
                    <button id="btn-set-email">Set new value for "email" model propery</button><br /><br />
                    <button id="btn-set-select">Set new value for "select" model propery</button><br /><br />
                    <button id="btn-set-check">Set new value for "check" model propery (true or false)</button><br /><br />
                    <hr />
                </p>
            </div>`,

            rendered: ({element}) => {
                // set some initial values
                model.name = "Initial name"
                model.email = "Initial email"
                
                model.bind(element.find("#model-area")); // bind returns created model

                element.find("#btn-set-name").on("click", () => {
                    let value = prompt("Please enter new value for model.name", model.name.value);
                    if (value != null) {
                        // same as model.email.value = value;
                        model.name = value;
                    }
                });

                element.find("#btn-set-email").on("click", () => {
                    let value = prompt("Please enter new value for model.email", model.email.value);
                    if (value != null) {
                        // same as model.email.value = value;
                        model.email = value;
                    }
                });

                element.find("#btn-set-select").on("click", () => {
                    let value = prompt("Please enter new value for model.select", model.select.value);
                    if (value != null) {
                        // model.select.value = value doesn't work!?
                        model.select = value.toLowerCase();
                    }
                });

                element.find("#btn-set-check").on("click", () => {
                    let value = prompt("Please enter new value for model.select", model.check.checked);
                    if (value != null) {
                        // same as model.check.checked = value.toLowerCase() === "true";
                        model.check = value.toLowerCase() === "true";
                    }
                });
            }
            
        }
    
    model.showButtonClick = () => {
        console.log("*** current model state ***");
        console.log("model.name.value: " + model.name.value);
        console.log("model.email.value: " + model.email.value);
        console.log("model.select.value: " + model.select.value);
        console.log("model.select.text: " + model.select.text);
        console.log("model.check.checked: " + model.check.checked);
        console.log("----------------------------------------------------------");
    }

    return module;
});