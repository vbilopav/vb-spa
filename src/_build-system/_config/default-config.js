/*
 * This is default configuration file.
 *
 * THIS FILE SHOULD NOT BE MODIFIED.
 * Build tool will always create working copy "user-config.js" (name can be set in build tools cli options -c or --config).
 * Working copy can be chanhed and adjusted to support specific application configuration needs.
 * This file is used only as template.
 * 
 */
({
    //Full directory path with default os path separators of source application directory.
    //Default (null) will set to directory one level bellow location of build tool.
    sourceDir: null,
    
    //Full directory for build outputs. Default (null) will be "build" dir in build tool directoy.
    buildDir: null,
    
    //
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
            expression:
                "{version:'${this.scriptsVersion ? this.scriptsVersion : ''}', appUrl: '${this.app ? this.app.targetDir : 'app'}', cssUrl: '${this.css ? this.css.targetDir : 'css'}', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}', sysPath: '${this.app.sysPath ? this.app.sysPath : 'spa'}', settings: {usePreloadedTemplates: false}}"
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
                    "../libs/feature-detect",
                    "../libs/require",
                    "../libs/text",
                    "spa/template",
                    "spa/cors-template",
                    "spa/cors-text"
                ],
                entryPoint: true
            }
        }
    }
})