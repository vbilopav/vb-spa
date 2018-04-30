/*
***     auto-generated at 2018-04-15T20:37:25.380Z      ***
***     to re-create delete or run build.js --force        ***

copy of default-config.js
*/
({
    sourceDir: null,
    buildDir: null,
    targetDir: null,
    autoTargetDirExp: "${new Date().toISOString().replace(/-/g, '').substring(0, 8)}",
    copy: "all",
    scriptsVersion: "",
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
            scriptContainerId: "_spa",
            name: "_spa",
            mode: "always",
            expression: "{version:'${this.scriptsVersion ? this.scriptsVersion : ''}', appUrl: '${this.app ? this.app.targetDir : 'app'}', cssUrl: '${this.css ? this.css.targetDir : 'css'}', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}', sysPath: '${this.app.sysPath ? this.app.sysPath : 'spa'}', settings: {usePreloadedTemplates: false}}"
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
            id: "_css"
        }
    },
    app: {
        sourceDir: "app",
        targetDir: "app",
        sysPath: "spa",
        minify: true,
        minifyInlineHtml: true,
        minifyEngine: "auto",
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
                    "../libs/feature-detect",
                    "../libs/require",
                    "../libs/text",
                    "spa/template",
                    "spa/cors-template",
                    "spa/cors-text",
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