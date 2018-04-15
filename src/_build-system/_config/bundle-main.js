/*
***     auto-generated at 2018-04-15T13:18:02.179Z      ***
***     to re-create delete run build.js --force        ***

targetModule: target module which will be replace by this bundle
includes: [] list of modules to bundle

*/
({
    targetModule: "main",
    includes: [
        "app",
        "main",
        "routes",
        "spa/cors-template",
        "spa/cors-text",
        "spa/extensions",
        "spa/model",
        "spa/router",
        "spa/template-helpers",
        "spa/template",
        "spa/view-manager",
        "template!templates/layout.html",
        "template!templates/navigation.html",
        "views/dynamic-data/di/class-module",
        "views/dynamic-data/di/injected/custom-module1",
        "views/dynamic-data/di/injected/custom-module2",
        "template!views/dynamic-data/di/injected/template.html",
        "views/dynamic-data/di/object-module",
        "template!views/dynamic-data/di/template.html",
        "views/dynamic-data/model-binding/declarative",
        "views/dynamic-data/model-binding/programmatic",
        "views/dynamic-data/remote-data-example/data",
        "views/dynamic-data/remote-data-example/framework-details",
        "views/dynamic-data/remote-data-example/frameworks",
        "text!views/home.html",
        "views/modules/class-module-change-element",
        "views/modules/class-module-element-manipulation",
        "views/modules/class-module-simple",
        "views/modules/events-handlings",
        "views/modules/module-plain-text-template",
        "views/modules/module-plain-text",
        "views/modules/object-module-change-element",
        "views/modules/object-module-element-manipulation",
        "views/modules/object-module-simple",
        "views/modules/view-events",
        "template!views/modules/_default.html",
        "text!views/not-found.html",
        "template!views/templates/composite/template1.html",
        "template!views/templates/composite/template2.html",
        "template!views/templates/composite/template3.html",
        "template!views/templates/composite/template4.html",
        "template!views/templates/composite/template5.html",
        "template!views/templates/composite/template6.html",
        "template!views/templates/parameterized-sub-route.html",
        "template!views/templates/parameterized.html",
        "text!views/templates/plain-text-view.html",
        "text!views/templates/state-view.html"
    ],
    entryPoint: true,
    replacementExp: "define('${this.targetModule}', [${\"'\" + this.includes.join(\"','\") + \"'\"}], () => { require('app')(); });"
})