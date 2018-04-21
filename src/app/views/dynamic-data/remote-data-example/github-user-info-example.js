define(["spa/model"], Model => class {

    render({element}) {
        element.html(
            String.html`
            <p>
                <h3>Github user data</h3>
                <input type="text" name="username">
                <br />
                <button name="show" onclick="showClick">Check model</button>
                </div>
            </p>`
        );
        
        this.username = "vbilopav"; // default value for the model
        this.model = new Model().bind(element, this);
    }

    showClick() {
        window.location = "#/github-user-info/" + this.model.username.value;
    }

});
