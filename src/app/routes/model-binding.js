define([], () => {

    return {

        "/declarative-binding-simple": {
            view: "views/model-binding/declarative-simple",
            data: {
                title: "Simple declarative binding",
                category: "model-binding"
            }
        }, 

        "/declarative-model-binding": {
            view: "views/model-binding/declarative",
            data: {
                title: "Model binding - declarative",
                category: "model-binding"
            }
        }, 

        "/programmatic-model-binding": {
            view: "views/model-binding/programmatic",
            data: {
                title: "Model binding - programmatic",
                category: "model-binding"
            }
        }, 

    }
});
