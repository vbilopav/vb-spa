define([], () => {

    return {

        "/todo-app-template-demo": {
            view: "template!views/todo-app/todo-template.html",
            data: {
                title: "todo app demo implemented in template",
                category: "todo"
            }
        },

        "/todo-app-module-demo": {
            view: "views/todo-app/todo-module",
            data: {
                title: "todo app demo implemented in module",
                category: "todo"
            }
        }

    }
});
