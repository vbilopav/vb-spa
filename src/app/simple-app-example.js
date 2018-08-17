define(["sys/view-manager/spa"], Manager => appElementId => {

    document.title = "Simple app demo";
    const app = document.getElementById(appElementId).html("");

    new Manager(app).reveal({
        view: "template!views/todo-app/todo-template.1.html"
    });
});
