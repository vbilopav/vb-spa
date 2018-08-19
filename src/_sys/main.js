define([
    "sys/models/model",
    "extension-Element/find",
    "extension-Element/forEachChild",
    "extension-Element/show",
    "extension-Element/hide",
    "extension-Element/appendTo",
    "extension-Element/on",
    "extension-Element/html",
    "extension-String/hashCode",
    "extension-String/html",
    "extension-String/toHTML",
    "extension!Window/on",
    "extension-Element/addClass",
    "extension-Element/removeClass",
    "sys/template/parser"
], Model => {

    _app.Model = Model;
    _app.import = m => new Promise(resolve => require(m, r => resolve(r)));

    require([_app.config.module], app => app(_app.config.elementId));

});
