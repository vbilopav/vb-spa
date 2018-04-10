/*
    
*** This configurationfile is automatically generated! ***
Change it freely to change your build configuration. To rebuild this file, delete it first and rerun build script.
         
targetFile: target file relative to app, will be overwritten by this bundle
targetModule: module of target file
includes: [] list of modules to bundle - reorder, rearange, remove or add freely - by default all modules are included
replacementExp: template expression that will return replacement for targetFile module or null to use targetFile content


*/
({
    targetFile: "main.js",
    targetModule: "main",
    includes: [        
        "sys/template-helpers",
        "sys/extensions",
        "sys/model",

        "template!templates/navigation.html",
        "template!templates/layout.html",

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
        "template!views/modules/_default.html",
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
        
        "sys/router",
        "sys/view-manager",
        "routes",
        
        "app",
        "main"
    ],
    replacementExp: "define('${this.targetModule}', [${\"'\" + this.includes.join(\"','\") + \"'\"}], () => { require('app')(); });"
})