/*
    
*** This configurationfile is automatically generated! ***
Change it freely to change your build configuration. To rebuild this file, delete it first and rerun build script.
         
copy of default-config.js

*/
({
    sourceDir: "/home/vedran/Documents/vs/vb-spa/src/",
    buildDir: "/home/vedran/Documents/vs/vb-spa/src/_build-system/build",
    targetDir: "/home/vedran/Documents/vs/vb-spa/src/_build-system/build/20180409",
    autoTargetDirExp: "${new Date().toISOString().replace(/-/g, '').substring(0, 8)}",
    index: {
        sourceFile: "index.html",
        targetFile: "index.html",
        minify: {
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
        },
        updateGlobalObjectScript: {
            id: "_spa-obj",
            mode: "always",
            contentExp: "window._spa={version:'', appUrl: '${this.app ? this.app.targetDir : 'app'}/', cssUrl: '${this.css ? this.css.targetDir : 'css'}/', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}/', settings: {usePreloadedTemplates: false}};"
        },
        globalObject: {
            scriptContainerId: "_spa-obj",
            name: "_spa",
            mode: "always",
            expression: "{version:'', appUrl: '${this.app ? this.app.targetDir : 'app'}/', cssUrl: '${this.css ? this.css.targetDir : 'css'}/', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}/', settings: {usePreloadedTemplates: false}}"
        }
    },
    libs: {
        sourceDir: "libs",
        targetDir: "libs",
        minify: true,
        minifyJsOptions: null,
        minifyEsOptions: null,
        minifyEngine: "uglify-js"
    },
    css: {
        sourceDir: "css",
        targetDir: "css",
        minify: true,
        bundle: {
            targetFile: "default.css",
            files: "all"
        },
        index: {
            nameExp: "${this.index.targetFile}",
            id: "_spa-css"
        }
    },
    app: {
        sourceDir: "app",
        targetDir: "app",
        minify: true,
        minifyEngine: "auto",
        htmlMinifierOptions: {
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
        },
        bundles: [
            "main.js"
        ]
    }
})