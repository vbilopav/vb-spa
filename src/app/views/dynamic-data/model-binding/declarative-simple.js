define(["spa/model"], Model => class {

    constructor() {
        this.model = new Model();
    }

    render() {
        return String.html`
        <p>
            <h3>Declarative binding</h3>
            <input type="text" name="text">
            <input type="checkbox" name="check" checked>
            <br />
            <button name="showButton" data-event-click="showButtonClick">Check model</button>
        </p>`;
    }

    rendered(_, element) {
        this.model.bind(element, this);
    }

    showButtonClick() {
        console.log("*** current model state ***");
        console.log("model.name.value: " + this.model.text.value);
        console.log("model.email.value: " + this.model.check.value);
        console.log("----------------------------------------------------------");
    }

});
