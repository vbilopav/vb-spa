define([], () => (object, extensions) => {

    extensions.forEach(e => {
        if (object.prototype[e] !== undefined) {
            throw new Error(`Error: Name collision - object ${object} already have defined "${e}" !`);
        }
    });

});