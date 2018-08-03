/**********************************************************
***     auto-generated at 2018-08-03T14:11:24.766Z      ***
***     to re-create delete or run build.js --force     ***
***********************************************************

targetModule: target module which will be replace by this bundle
includes: [] list of modules to bundle

*/
({
    targetModule: "main",
    includes: [
        "app",
        "main",
        "routes/dynamic",
        "routes/main",
        "routes/modules",
        "routes/templates",
        "template!templates/layout.html",
        "template!templates/navigation.html",
        "views/dynamic-data/di/class-module",
        "views/dynamic-data/di/injected/custom-module1",
        "views/dynamic-data/di/injected/custom-module2",
        "template!views/dynamic-data/di/injected/template.html",
        "template!views/dynamic-data/di/template.html",
        "views/dynamic-data/model-binding/declarative-simple",
        "views/dynamic-data/model-binding/declarative",
        "views/dynamic-data/model-binding/programmatic",
        "views/dynamic-data/remote-data-example/data",
        "views/dynamic-data/remote-data-example/framework-details",
        "views/dynamic-data/remote-data-example/frameworks",
        "views/dynamic-data/remote-data-example/github-user-info-example",
        "views/dynamic-data/remote-data-example/github-user-info",
        "template!views/dynamic-data/remote-data-example/promise-in-template.html",
        "text!views/home.html",
        "template!views/modules/_default.html",
        "views/modules/class-module-change-element",
        "views/modules/class-module-element-manipulation",
        "views/modules/class-module-simple",
        "views/modules/events-handlings",
        "views/modules/module-plain-text-template",
        "views/modules/module-plain-text",
        "views/modules/new-bundle/module-view",
        "text!views/modules/new-bundle/template.html",
        "views/modules/view-events",
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
        "text!views/templates/state-view.html",
        "template!views/templates/unbundled-parametrized-view.html",
        "text!views/templates/unbundled-text-view.html"
    ],
    entryPoint: true,
    replacementExp: "define('${this.targetModule}', [${\"'\" + this.includes.join(\"','\") + \"'\"}], () => { require('app')(); });"
})