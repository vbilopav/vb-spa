/**********************************************************
***     auto-generated at 2018-08-03T14:10:07.544Z      ***
***     to re-create delete or run build.js --force     ***
***********************************************************


*/
({
    sourceDir: "../src",
    buildDir: "./build",
    targetDir: null,
    autoTargetDirExp: "${new Date().toISOString().replace(/[-T:]/g, '').substring(0, 12)}",
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
            scriptContainerId: "_app",
            name: "_app",
            mode: "always",
            expression: "{dev: false, version:'${this.scriptsVersion ? this.scriptsVersion : ''}', appUrl: '${this.app ? this.app.targetDir : 'app'}', cssUrl: '${this.css ? this.css.targetDir : 'css'}', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}', sysPath: '${this.app.sysPath ? this.app.sysPath : '../_sys'}', settings: {usePreloadedTemplates: false}}"
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
        sysPath: "../_sys",
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
                    "libs/feature-detect",
                    "libs/require",
                    "libs/text",
                    "sys/template",
                    "sys/cors-template",
                    "sys/cors-text",
                    "sys/extensions"
                ],
                entryPoint: true
            }
        }
    }
})