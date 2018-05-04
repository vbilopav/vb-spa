/*
 * This is default configuration file.
 *
 * THIS FILE SHOULD NOT BE MODIFIED.
 * 
 * Build tool will always create working copy "user-config.js" 
 * (name can be set in build tools cli options -c or --config).
 * 
 * Working copy can be changed and adjusted to support specific application configuration needs.
 * This file is used only as template to hold default values and create custom config files.
 * 
 */
({
    // Directory path for source application directory (absoulute or relative).
    // Default is set to directory one level bellow location of build tool.
    sourceDir: "../",
    
    // Directory path for build results (absoulute or relative).
    // Build results include build log file and new directory with build result.
    // Build directory is created only if it doesn't exists.
    // Default is "build" directory in build tool dreictory.
    buildDir: "./build",
    
    // Directory name for build target. 
    // Build target if log file with targetDir name and directory in buildDir with targetDir name
    // and complete build results.
    // Target build directory and buil log file are always recreated.
    // When null, value is result autoTargetDirExp expression. That is default.
    targetDir: null,

    // Expression to atumatically generate targetDir value that will be used for target directory and log file.
    // Default is current utc date and time in format "YYYYMMDDHHmmSS"
    autoTargetDirExp: "${new Date().toISOString().replace(/[-T:]/g, '').substring(0, 12)}",

    // List of custom files, not part of application system (not in app, libs or css directory) to be copied into build.
    // Accepts array of strings with file names, or "all" for all files.
    copy: "all",

    // Scripts version string that will be added to every script request (JavaScript and css) 
    // as querystring parameter "v=scriptsVersion" to be used for cache busting.
    // By default, cache busting by querystring "v" parameter isn't used.
    scriptsVersion: "",

    // index single page file configuration
    index: {

        // Source file name of single page file in sourceDir. 
        // Build will exit unaxpectedly if it doesn't exist.
        // By default it is "index.html"
        sourceFile: "index.html",
        
        // Target file of single page file in targetDir. 
        // Recreated on every build.
        // By default it is "index.html"
        targetFile: "index.html",

        // Minify options for single page file. Options are:
        // - false or null to skip minification and simply copy index file as is, or
        // - options object defined in html-minifier npm package - https://www.npmjs.com/package/html-minifier
        minify: {
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
        },

        // Options for global appliaction object defined in single page index file as inline script
        // Defualt is defined bellow, undefinied or null will skip global appliaction object inline script manipulation.
        globalObject: {

            // id value for inline script containing definition of global application object
            scriptContainerId: "_spa",

            // name for global application object
            name: "_spa",

            // Allowed values are self-explanatory "always" or "not-exists": 
            // not-exists will update global object script only if doesn't exist and always will always.
            mode: "always",
            
            // Expression that will generate global application object definition.
            // Expression have this script values as prototype object (this reference).
            expression:
                "{version:'${this.scriptsVersion ? this.scriptsVersion : ''}', appUrl: '${this.app ? this.app.targetDir : 'app'}', cssUrl: '${this.css ? this.css.targetDir : 'css'}', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}', sysPath: '${this.app.sysPath ? this.app.sysPath : 'spa'}', settings: {usePreloadedTemplates: false}}"
        }
    },

    // Configuration for custom scripts and libraries directory. 
    // Based on these values - will create another configuration file "_config/libs.js" 
    // where every file from libs directory can be individually configured:
    // 'file name relative to libs dir': {
    //     minify: false to copy, true for default minify config or minify options object,
    //     minifyEngine: uglify-es, uglify-js,
    //     module: module id if required inside application
    // }
    libs: {

        // Source directory with custom libaries, relative sourceDir.
        // Build will exit unaxpectedly if it doesn't exist.
        sourceDir: "libs",

        // Tagret directory with custom libaries, relative targetDir.
        // Recreated on every build. It can be appended with version number to use as cache buster.
        targetDir: "libs",

        // Minify js file, true or false.
        // This values is used as template for every file in lib.js configuration.
        minify: true,

        // Object with options for uglify-js minifier of ES5 scripts.
        // null is default options. See more at https://www.npmjs.com/package/uglify-js
        // This values is used as template for every file in lib.js configuration.
        minifyJsOptions: null,

        // Object with options for uglify-es minifier of ES6 scripts.
        // null is default options. See more at https://www.npmjs.com/package/uglify-es
        // This values is used as template for every file in lib.js configuration.
        minifyEsOptions: null,

        // Which minifier engine to use "uglify-js" or "uglify-es"
        // This values is used as template for every file in lib.js configuration.
        minifyEngine: "uglify-js"
    },

    // Configuration css files directory. 
    // Based on these values - will create another configuration file "_config/css.js" 
    // where every file from css directory can be individually configured:
    // 'file name relative to css dir': {
    //    minify: false to copy, true for default minify config or minify options object,
    // }
    css: {
        
        // Source directory css files, relative sourceDir.
        // Build will exit unaxpectedly if it doesn't exist.
        sourceDir: "css",

        // Tagret directory with css files, relative targetDir.
        // Recreated on every build. It can be appended with version number to use as cache buster.
        targetDir: "css",

        // false or null to skip css minification and copy file as-is,
        // true to use default options for clean-css package process or
        // object with options for clean-css. See more at https://github.com/jakubpawlowicz/clean-css
        // This values is used as template for every file in css.js configuration.
        minify: true,

        // css bundling options
        // if not defined or null, bundling of css will be skipped
        bundle: {
            
            // target file, relative to css.targetDir of css bundle
            targetFile: "default.css",

            // list of files, array of string with file name - to be included in css bundle
            // or "all" for every css file in css directory.
            files: "all"
        },

        // Options for css include inline script in index single page file
        index: {

            // name of index file
            nameExp: "${this.index.targetFile}",
            
            // id of inline script that includes css scripts
            // If there is bundling included, generated script will include bundle or bundle and diffrence...
            id: "_css"
        }
    },

    // Application directory options.
    // Based on these values - will create another configuration file "_config/app.js" 
    // where every file from app directory can be individually configured:
    // 'file name relative to app dir': {
    //    minify: false to copy, true for default minify config or minify options object,
    //    minifyInlineHtml: minify inline html inside js file
    //    minifyEngine: uglify-es, uglify-js or html-minifier
    // }
    app: {
        
        // Source directory for application files, relative sourceDir.
        // Build will exit unaxpectedly if it doesn't exist.
        sourceDir: "app",

        // Tagret directory with css files, relative targetDir.
        // Recreated on every build. It can be appended with version number to use as cache buster.
        targetDir: "app",

        // System dir cotnaining framework modules, relative to app dir. Bad things will happen if it doesn't exists.
        sysPath: "spa",
        
        // Minify file true or false. False will copy file as-is.
        // This values is used as template for every file in app.js configuration.
        minify: true,

        // Minify inline html content inside JavaScript files, true or false.
        // If it is true, htmlMinifierOptions will be used as default options for minification.
        // This values is used as template for every file in app.js configuration.
        minifyInlineHtml: true,

        // Default minifaction engine to be set for each individual file/module in app.js configuration.
        // Values are: "auto", "minify-js", "minify-es" or "html-minifier".
        // Value "auto" will set "html-minifier" for each html file and "minify-es" for each js file.
        // Assumption is that every application module is written in ES6.
        minifyEngine: "auto",

        // Object with options for uglify-js minifier of ES5 scripts.
        // null is default options. See more at https://www.npmjs.com/package/uglify-js
        // This values is used as template for every file in lib.js configuration.
        minifyJsOptions: null,

        // Object with options for uglify-es minifier of ES6 scripts.
        // null is default options. See more at https://www.npmjs.com/package/uglify-es
        // This values is used as template for every file in lib.js configuration.
        minifyEsOptions: null,
        
        // Minify options for html files.
        // Default options are hardcoded bellow. See more at https://www.npmjs.com/package/html-minifier
        htmlMinifierOptions: {
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
        },

        // Object with with keys module id's replaced with bundle
        // Each key will create another configuration file "_config/bundle-module-id.js" (slashes replaced with dashes)
        // that can be configured individually. Created configuration will have followinf properties:
        //  - targetModule: target module which will be replace by this bundle
        //  - includes: [] list of modules to bundle
        //  - entryPoint: true or optional false
        //  - replacementExp - optional expression that will replace content of targetModule if it is needed (for entry point modules it is). 
        moduleBundles: {
            
            // Existing module id to be replaced with bundled version. 
            // Assumption is that module is included in bundle, otherwise application will have module missing.
            'main': {

                // list of module id's to be included in this bundle - array of string, 
                // or "all" for all modules
                includes: "all",

                // Exclude following module id's from this bundle - array of strings.
                // Makes only sense when includes is "all".
                excludes: [
                    "libs/feature-detect",
                    "libs/require",
                    "libs/text",
                    "spa/template",
                    "spa/cors-template",
                    "spa/cors-text"
                ],

                // For entry point modules, all modules in bundle need to be required first after they are defined.
                // Only way to achieve this is with replacement expression that is generated for entry point modules,
                // that will require all defined module in first bundle and require and execute "app" module.
                entryPoint: true
            }
            //, 
            // 'views/modules/new-bundle/module-view': {
            //    includes: [
            //        "text!views/modules/new-bundle/template.html",
            //        "views/modules/new-bundle/module-view"
            //    ],
            //    excludes: []
            // }
        }
    }
})