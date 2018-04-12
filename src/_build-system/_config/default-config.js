({
    sourceDir: null,
    buildDir: null,
    targetDir: null,
    autoTargetDirExp: "${new Date().toISOString().replace(/-/g, '').substring(0, 8)}",
    copy: "all",
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
        globalObject: {
            scriptContainerId: "_spa-obj",
            name: "_spa",
            mode: "always",
            expression:
                "{version:'', appUrl: '${this.app ? this.app.targetDir : 'app'}/', cssUrl: '${this.css ? this.css.targetDir : 'css'}/', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}/', sysPath: '${this.app.sysPath ? this.app.sysPath : 'spa'}', settings: {usePreloadedTemplates: false}}"
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
        sysPath: "spa",
        minify: true,
        minifyInlineHtml: true,
        minifyEngine: "auto",
        minifyJsOptions: null,
        minifyEsOptions: null,
        htmlMinifierOptions: {
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
        },
        moduleBundles: {
            'main': {
                includes: "all",
                excludes: [
                    "../libs/require",
                    "../libs/text",
                    "sys/template",
                    "sys/cors-template",
                    "sys/cors-text",
                    "template!views/templates/unbundled-parametrized-view.html",
                    "text!views/templates/unbundled-text-view.html",
                    "text!views/modules/new-bundle/template.html",
                    "views/modules/new-bundle/module-view"
                ],
                entryPoint: true
            },
            'views/modules/new-bundle/module-view': {
                includes: [
                    "text!views/modules/new-bundle/template.html",
                    "views/modules/new-bundle/module-view"
                ],
                excludes: []
            }
        }
    }
})