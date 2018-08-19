define([], () => {

    return {
        forEach: (obj, template) => (obj instanceof Array ? obj : Object.entries(obj || {})).map(
            (item, index) => template(...(item instanceof Array ? item : [item]), index)
        ).join(""),

        import: name => require(name),

        css: {
            import: (...names) => {
                document.head.appendChild(
                    `<style type="text/css">
                        ${names.map(item => require(item.startsWith("text!") ? item : "text!" + item)).join("")}
                    </style>`.toHTML()
                )
            }
        },

        if: (condition, templateTrue, templateFalse) => (condition ? templateTrue : templateFalse),
    }

});
