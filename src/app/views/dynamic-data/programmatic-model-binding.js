define(["sys/model"], Model => {

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
                    View location: <pre>/app/views/dynamic-data/programmatic-model-binding.js</pre>                                
                    <br />
                    <span id="model-area">
                        <label for="name" style="width: 75px">Name: </label><input name="name" type="text"><br />
                        <label for="email" style="width: 75px">Email: </label><input name="email" type="email"><br />
                        <label for="frameworks" style="width: 71px">Select: </label>
                        <select name="select">
                            <option value="">select framework...</option>
                            <option value="ember">Ember 1.13.8 ~ 486K</option>
                            <option value="angular2">Angular 2 ~ 566K</option>                                                    
                            <option value="angular">Angular 1.4.5 ~ 143K</option>
                            <option value="vue">Vue 2.4.2 ~ 58.8K</option>
                            <option value="inferno">Inferno 1.2.2 ~ 48K</option>
                            <option value="preact">Preact 7.2.0 ~ 16K</option>
                            <option value="react">React 16.2.0 + React DOM ~ 97.5K</option>
                            <option value="this">This framework so far... ~ 6.61K</option>
                        </select>
                        <br />
                        <input type="checkbox" id="check_id" name="check">Check box can ne checked!<br />
                        <br />
                        <button name="showButton">Check model state in console output</button>
                    </span>
                    <hr />
                    <button id="btn-set-name">Set new value for "name" model propery</button><br /><br />
                    <button id="btn-set-email">Set new value for "email" model propery</button><br /><br />
                    <button id="btn-set-select">Set new value for "select" model propery</button><br /><br />
                    <button id="btn-set-check">Set new value for "check" model propery (true or false)</button><br /><br />
                    <hr />
                </p>
            </div>`,    

            rendered: (params, element) => {
                model
                    .bind(element.find("#model-area")) // bind returns created model
                    .showButton.on("click", model.showButtonClick) // events must be assigned manually
                                
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