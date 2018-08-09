define([], () => {

    return {

        "/todo-app-template-demo": {
            view: "async-template!views/todo-app/todo-template.html",
            data: {
                title: "todo app demo implemented in template",
                category: "todo"
            }
        },
    }
});
