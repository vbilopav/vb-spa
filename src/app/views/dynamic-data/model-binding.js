define(["sys/model"], Model => {

    const
        model = new Model(),
        module = {        
            render: () => String.html`
            <div>
                <h3>Model binding support</h3>    
                <p>
                    Demonstration for bi-directional model binding support
                    <br /><br />
                    View location: <pre>/app/views/dynamic-data/model-binding.js</pre>                                
                    <br />
                    <span id="model-area">
                        <label for="name" style="width: 50px">Name: </label><input name="name" type="text"><br />
                        <label for="email" style="width: 50px">Email: </label><input name="email" type="email"><br />
                        <label for="frameworks" style="width: 50px">Select: </label>
                        <select name="frameworks">
                            <option value="">select framework...</option>
                            <option value="Ember 2.2.0">Ember 2.2.0 ~ 435K</option>
                            <option value="Ember 1.13.8">Ember 1.13.8 ~ 486K</option>
                            <option value="Angular 2">Angular 2 ~ 566K</option>
                            <option value="Angular 2 + Rx">Angular 2 + Rx ~ 766K</option>
                            <option value="Angular 1.4.5">Angular 1.4.5 ~ 143K</option>
                            <option value="Vue 2.4.2">Vue 2.4.2 ~ 58.8K</option>
                            <option value="Inferno 1.2.2">Inferno 1.2.2 ~ 48K</option>
                            <option value="Preact 7.2.0">Preact 7.2.0 ~ 16K</option>
                            <option value="React 0.14.5 + React DOM">React 0.14.5 + React DOM ~ 133K</option>
                            <option value="React 0.14.5 + React DOM + Redux">React 0.14.5 + React DOM + Redux~139K</option>
                            <option value="React 16.2.0 + React DOM">React 16.2.0 + React DOM ~ 97.5K</option>
                            <option value="This framework so far...">This framework so far... ~ 5.24K</option>
                        </select>
                        <br />
                        <input type="checkbox" name="check">This framework so far... ~ 5.24K<br />
                        <br />
                        <button name="showButton" data-event-click="showButtonClick">Check model state in console output</button>
                    </span>
                    <hr />
                </p>
            </div>`,    

            rendered: (params, element) => {
                //
                // Binds everything inside element argument, creates properties on model, first by name, then by id 
                // If name and id don't exist it will be skipped.
                // Binds events also with data-event-eventname
                //
                model.bind(element.find("#model-area"));                
            }
            
        }
    
    model.showButtonClick = () => {
        console.log("Current model state: ");
        console.log("model.name.value: " + model.name.value);
        console.log("model.email.value: " + model.email.value);
        console.log("model.frameworks.value: " + model.frameworks.value);
        console.log("model.frameworks.text: " + model.frameworks.text);
        console.log("model.check.checked: " + model.check.checked);
        console.log("");
    }
    
    return module;
});