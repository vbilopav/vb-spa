define(["sys/view-manager/reveal"], reveal => id => {

    document.title = "Simple app demo";

    reveal({
        view: "template!views/todo-app/todo-template.1.html",
        elementOrId: document.getElementById(id).html("")
    });
});
