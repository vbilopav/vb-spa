define([], () => {

    return {

        "/component-demo": {
            view: "views/components/simple-parse-import-demo",
            data: {
                title: "Simple parse inside class view demo",
                category: "components"
            }
        },

        "/composition-demo1": {
            view: "views/components/simple-composition-demo1",
            data: {
                title: "Simple view composition demo 1",
                category: "components"
            }
        },

        "/composition-demo2": {
            view: "views/components/simple-composition-demo2",
            data: {
                title: "Simple view composition demo 2",
                category: "components"
            }
        },
    }
});
