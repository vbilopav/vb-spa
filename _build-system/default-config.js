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
    // Directory path for source application directory (absolute or relative). 
    // This is where your source files are.
    // Default is set src directory at same level as directrory of build tool.
    sourceDir: "../src",
    
    // Directory path for build results (absolute or relative). 
    // Build results include build log file and new directory with build results. 
    // Build directory is created only if it doesn't exists. 
    // Default is `build` directory within build tool directory.
    buildDir: "./build",
    
    // Directory name for build target.
    // Build target is log file with `targetDir` name and directory in `buildDir` with `targetDir` name and complete build results.
    // For example if your `buildDir` is `./build` and `targetDir` is `output`, you will have build results in `./build/output/` and you will also have new log file names `./build/output.log` 
    // Target build directory and build log file are always recreated.
    // When value is `null` (that is default) - actual value is copied from results of `autoTargetDirExp` expression. 
    targetDir: null,

    // Expression that, when executed - automatically generates `targetDir` value 
    // that will be used for target directory and log file. 
    // Whatever value is in `autoTargetDirExp` - it will be ignored if `targetDir` already have some other value. 
    // `targetDir` have to be `null` in order to `autoTargetDirExp` to work.
    // Default is current `utc` date and time in format `YYYYMMDDHHmm`.
    autoTargetDirExp: "${new Date().toISOString().replace(/[-T:]/g, '').substring(0, 12)}",

    // List of custom files, not any part of application system (not in `app`, `libs` or `css` directory) - which are automatically copied into build output.
    // Accepts any array of strings with file names, relative to `sourceDir` - or `all` for all files.
    copy: "all",

    // Scripts version string that will be added to every script request (JavaScript and CSS) 
    // as extra query string parameter `v=scriptsVersionValue` that can be used for cache busting. 
    // Cache busting is technique where we intentionally change scripts url to instruct browser to 
    // bypass local cache and go for the newest version. We can do that with url query string, 
    // but there are some other preferred ways, like changing url directory part.
    // By default, cache busting by query string `v` parameter isn't used.
    scriptsVersion: "",

    // Single page HTML file configuration object.
    index: {

        // Source single page file name of single page application in `sourceDir`. 
        // Build process will exit unexpectedly if that file doesn't exist.
        sourceFile: "index.html",
        
        // Target single page file name of single page application in `targetDir`. 
        // This file is recreated  on every build.
        targetFile: "index.html",

        // Minify options for single page file. Possible values are:
        //- `false` or `null` or `undefined` - to skip minification and simply copy index file as is.
        //- html minifier options object as defined in https://www.npmjs.com/package/html-minifier
        minify: {
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
        },

        // Options for global application object defined in single page index file as inline script and described in 
        // [Setting up basic application configuration in page head]
        // Object default is as defined bellow, `undefined` or `null` will skip global application object inline script manipulation.
        globalObject: {

            // Value of `id` attribute for inline script containing definition of global application object.
            scriptContainerId: "_spa",

            // Name for global application object that will be created and available in global scope (JavaScript `window`).
            name: "_spa",

            // Allowed values are self-explanatory - `always` or `not-exists`:
            // - `not-exists` will update global object script only if element doesn't exist and
            // - `always` will always update global object script.
            mode: "always",
            
            // Expression that will generate global application object definition. 
            // Expression have this script values as prototype object (`this` reference) available, 
            // so any value from this configuration object can be accessed when expression is executed.
            // By default, this expression is taking appropriate values from this configuration.
            expression:
                "{version:'${this.scriptsVersion ? this.scriptsVersion : ''}', appUrl: '${this.app ? this.app.targetDir : 'app'}', cssUrl: '${this.css ? this.css.targetDir : 'css'}', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}', sysPath: '${this.app.sysPath ? this.app.sysPath : 'spa'}', settings: {usePreloadedTemplates: false}}"
        }
    },

    // Configuration object for custom scripts and libraries directory. 
    // Based on these values here - build will create another configuration file for scripts and libraries `_config/libs.js`
    // where every file from `libs` source directory can be individually configured.
    libs: {

        // Source directory with custom libraries, relative to main `sourceDir`. 
        // Build process will exit unexpectedly if it doesn't exist.
        sourceDir: "libs",

        // Target directory with custom libraries, relative to `targetDir`. 
        // This directory is recreated on every build. 
        // It doesn't have to match source name, and it can be appended with version number or it can have whatever custom name. 
        // When this name is changed, that doesn't mean that all module references in you application have to changed too, they can point to alias `libs/library`
        // This essential for **cache busting** mechanism for libraries. Whatever your target directory name is, you can always reference it with `libs` alias as part of module id, so code doesn't have to be changed.
        targetDir: "libs",

        // Should JavaScript library file be minified, `true` or `false`. 
        // This value is on level of individual file, and it is used as template value in multistage build. 
        // Written for every file in `libs` directory as template when creating `lib.js` configuration.
        minify: true,

        // Options object of `uglify-js` minifier for ES5 scripts. 
        // Default value is `null`. See more at [`https://www.npmjs.com/package/uglify-js`]
        // This value is on level of individual file, and it is used as template value in multistage build. 
        // Written for every file in `libs` directory as template when creating `lib.js` configuration.
        minifyJsOptions: null,

        // Options object of `uglify-es` minifier for ES6 scripts. 
        // Default value is `null`. See more at [`https://www.npmjs.com/package/uglify-es`]
        // This value is on level of individual file, and it is used as template value in multistage build.
        // Written for every file in `libs` directory as template when creating `lib.js` configuration.
        minifyEsOptions: null,

        // Select which minifier engine to will be set on level of each individual file in multistage build.
        // Written for every file in `libs` directory as template when creating `lib.js` configuration.
        // Available values are `"uglify-js"` for ES5 minification or `"uglify-es"` or ES6 minification. 
        // Default values are `"uglify-js"`, since working assumptions are that all libarires are ES5 scripts, 
        //but that can be changed for every file in system.
        minifyEngine: "uglify-js"
    },

    // Configuration object for directory with CSS style sheet files. 
    // Based on these values here - build will create another configuration file for scripts and libraries `_config/css.js` 
    // where every file from `css` source directory can be individually configured.
    css: {
        
        // Source directory with CSS style sheet files, relative to main `sourceDir`.
        // Build process will exit unexpectedly if it doesn't exist.
        sourceDir: "css",

        // Target directory with with CSS style sheet files, relative to `targetDir`. 
        // This directory is recreated on every build. 
        // It doesn't have to match source name, and it can be appended with version number or it can have whatever custom name.
        // This essential for **cache busting** mechanism for libraries. 
        // Inline script in index file will take care of appropriate references.
        targetDir: "css",

        // Should CSS style sheet files be minified  - `true` - or copied `false`. Default is `true`.
        minify: true,

        // Bundling options for CSS style sheet files. Can be `undefined` or `null` to skip CSS bundling.
        bundle: {
            
            // Bundle result, bundle target file. File name is relative to `css.targetDir`.
            targetFile: "default.css",

            // List of CSS style-sheet files to be included in bundle.
            // Accepts array of strings with file names or `"all"` for every CSS style-sheet `css.targetDir` directory.
            files: "all"
        },

        // Options for `css inline script` to include css scripts inside index single page file.
        // Can be `undefined` or `null` to skip insertion of css inline script.
        index: {

            // Expression that returns name of index single page file.
            // By default it points to target index single page file defined in this configuration file.
            nameExp: "${this.index.targetFile}",
            
            // `id` attribute of inline script element  inside index single page file that includes CSS scripts.
            // If there is bundling included, generated script will include bundle or 
            // it will include bundle and the rest of CSS files, or all CSS files that are copied of minified.
            id: "_css"
        }
    },

    // Main application directory options.
    // Based on these values here - build will create another configuration file for all scripts and
    // modules `_config/app.js` where every file from `app` source directory can be individually configured.
    app: {
        
        // Source directory with application files, relative to main `sourceDir`.
        // Build process will exit unexpectedly if it doesn't exist.
        sourceDir: "app",

        // Target directory with application files, relative to `targetDir`.
        // This directory is recreated on every build.
        // It doesn't have to match source name, and it can be appended with version number or it can have whatever custom name.
        // When this name is changed, that doesn't mean that all module references in you application have to changed too, they can point to same module names.
        // This essential for **cache busting** mechanism for application modules. Whatever your target directory name is, your module id's remain the same.
        targetDir: "app",

        // System directory containing framework modules, relative to `app.targetDir`. Needed by build tool.
        sysPath: "spa",
        
        // Should application files be minified, `true` or `false`.
        // This value is on level of individual file, and it is used as template value in multistage build. 
        // Written for every file in `app` directory as template when creating `app.js` configuration.
        minify: true,

        // Should inline HTML inside JavaScript modules be minified, `true` or `false`.
        // This value is on level of individual file, it is only relevant with files with `.js` extension, 
        // and it is used as template value in multistage build. 
        // Written for every file in `app` directory as template when creating `app.js` configuration.
        minifyInlineHtml: true,

        // Default minifaction engine to be set for each individual file/module in `app.js` configuration.
        // Available values are: `"auto"`, `"minify-js"`, `"minify-es"` or `"html-minifier"`.
        // Value `"auto"` will set `"html-minifier"` for each HTML file and `"minify-es"` for each JavaSript file.
        // Working assumption is that every application module is written is ES6 module, but that doesn't mean that it have to be.
        minifyEngine: "auto",

        // Options object of `uglify-js` minifier for ES5 scripts. 
        // Default value is `null`. See more at https://www.npmjs.com/package/uglify-js
        // This value is on level of individual file, and it is used as template value in multistage build.
        // Written for every file in `app` directory as template when creating `app.js` configuration.
        minifyJsOptions: null,

        // Options object of `uglify-es` minifier for ES6 scripts.
        // Default value is `null`. See more at `https://www.npmjs.com/package/uglify-es`
        // This value is on level of individual file, and it is used as template value in multistage build.
        // Written for every file in `app` directory as template when creating `app.js` configuration.
        minifyEsOptions: null,
        
        // Options object of [`html-minifier`](https://www.npmjs.com/package/html-minifier) minifier for HTML files.
        // This value is on level of individual file, and it is used as template value in multistage build. 
        // Written for every file in `app` directory as template when creating `app.js` configuration.
        htmlMinifierOptions: {
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true
        },
        
        // List of module bundles. Object where keys are module id's that will be replaced with bundle.
        // Each key will create another configuration file "_config/bundle-module-id.js" (slashes replaced with dashes) that can be individually configured.
        moduleBundles: {
            
            // List of module id's to be included in this bundle - array of string, or `all` for all modules. 
            'main': {

                // List of module id's to be included in this bundle - array of string, or `all` for all modules.
                includes: "all",

                // Exclude following module id's from this bundle - array of strings. 
                // Obviously, only makes only sense for `includes: "all"`.
                // For example, entry point `main` would exclude `feature-detect` script, because it needs to be loaded before module loader, 
                // then module loader itself because module loader cannot be loaded by module loader, 
                // and finally all of module loader plug-ins, since `requirejs` doesn't work well with bundled and reloaded plug-ins.
                excludes: [
                    "libs/feature-detect",
                    "libs/require",
                    "libs/text",
                    "spa/template",
                    "spa/cors-template",
                    "spa/cors-text"
                ],

                // If your bundle is application entry point - build tool needs to know about that. Another reason to re-write `requirejs.
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