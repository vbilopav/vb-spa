define([], () => {

    return {
        forEach: (obj, template) => (obj instanceof Array ? obj : Object.entries(obj)).map(
            (item, index) => template(...(item instanceof Array ? item : [item]), index)).join(''),

        import: name => require(name),

        if: (condition, templateTrue, templateFalse) => (condition ? templateTrue : templateFalse),
    }

});
