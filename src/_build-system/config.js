const
    fs = require("fs"),
    fsutil = require("./fs-util"),
    path = require("path"),
    sep = path.sep,    
    log = fsutil.log,
    splitted = __dirname.split(sep);

const parseRoot = config => {
    if (!config.sourceDir) {    
        config.sourceDir = splitted.slice(0, splitted.length-1).join(sep) + sep;
        log("config.sourceDir set to default " + config.sourceDir)
    }

    if (!fs.existsSync(config.sourceDir)) {
        throw new Error(`error: config.sourceDir ${config.sourceDir} doesn't seem to exist!`);
    }

    if (!config.buildDir) {    
        config.buildDir =  path.join(__dirname, "build");
        log("config.buildDir set to default " + config.buildDir)
    }

    if (!config.autoTargetDirExp && !config.autoTargetDirExp) {
        config.autoTargetDirExp = "'output'";
        log("config.autoTargetDirExp set to default " + config.autoTargetDirExp)
    }

    if (!config.targetDir) {    
        config.targetDir = path.join(config.buildDir, eval(config.autoTargetDirExp));
        log("config.targetDir set to auto " + config.targetDir)
    }
}

const parseIndex = config => {
    if (!config.index) {
        config.index = false;
        log("config.index section will be skipped! ");
        return;
    }    

    if (!config.index.sourceFile || typeof config.index.sourceFile !== "string") {
        config.index.sourceFile = "index.html";
        log("config.index.sourceFile set to default " + config.index.sourceFile)
    }

    var check = path.join(config.sourceDir, config.index.sourceFile)
    if (!fs.existsSync(check)) {
        throw new Error(`error: config.index.sourceFile ${check} doesn't seem to exist!`);
    }

    if (!config.index.targetFile || typeof config.index.targetFile !== "string") {
        config.index.targetFile = "index.html";
        log("config.index.targetFile set to default " + config.index.targetFile);
    }

    if (!config.index.minify) {
        config.index.minify = false;
        log("config.index.minify set to default false, index will be copied...");
    } else if (typeof config.index.minify !== "object") {
        config.index.minify = {
            minifyJS: true, 
            minifyCSS: true, 
            removeAttributeQuotes: true, 
            removeComments: true, 
            removeEmptyAttributes: true, 
            collapseWhitespace: true
        };
        log("config.index.minify set to default " + JSON.stringify(config.index.minify));
    }

    if (
        config.index.updateGlobalObjectScript === undefined ||
        (config.index.updateGlobalObjectScript && typeof config.index.updateGlobalObjectScript !== "object")
     ) {
        config.index.updateGlobalObjectScript = {id: "_spa-obj", mode: "always"};
        log("config.index.updateGlobalObjectScript set to default " + JSON.stringify(config.index.updateGlobalObjectScript));
    }

    if (config.index.updateGlobalObjectScript) {
        let obj = config.index.updateGlobalObjectScript;
        if (typeof obj.id !== "string") {
            obj.id = "_spa-obj";
            log("config.index.updateGlobalObjectScript.id set to default " + obj.id);    
        }
        if (["always", "not-exists"].indexOf(obj.mode)) {
            obj.id = "always";
            log("config.index.updateGlobalObjectScript.mode set to always. Allowed modes are ['always', 'not-exists'] " + obj.id);
        }
        if (typeof obj.content !== "string") {
            obj.content = "window._spa={version:'', appUrl: '${this.app ? this.app.targetDir : 'app'}/', cssUrl: '${this.css ? this.css.targetDir : 'css'}/', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}/', settings: {usePreloadedTemplates: false}};";
            log("config.index.updateGlobalObjectScript.content set to default " + obj.content);    
        }
    }
}

const parseLibs = config => {

    if (!config.libs) {
        config.libs = false;
        log("config.libs section will be skipped! ");
        return;
    }

    if (!config.libs.sourceDir || typeof config.libs.sourceDir !== "string") {
        config.libs.sourceDir = "libs";
        log("config.libs.sourceDir set to default " + config.libs.sourceDir)
    }

    var check = path.join(config.sourceDir, config.libs.sourceDir)
    if (!fs.existsSync(check)) {
        throw new Error(`error: config.libs.sourceDir ${check} doesn't seem to exist!`);
    }

    if (!config.libs.targetDir || typeof config.libs.targetDir !== "string") {
        config.libs.targetDir = "libs";
        log("config.libs.targetDir set to default " + config.libs.targetDir);
    }

    if (typeof config.libs.minify !== "boolean" && typeof config.libs.minify !== "object") {
        config.libs.minify = true;
        log("config.libs.minify set to default " + config.libs.minify);
    }
}

const parseCss = config => {

    if (!config.css) {
        config.css = false;
        log("config.css section will be skipped! ");
        return;
    }

    if (!config.css.sourceDir || typeof config.css.sourceDir !== "string") {
        config.css.sourceDir = "css";
        log("config.css.sourceDir set to default " + config.css.sourceDir)
    }

    var check = path.join(config.sourceDir, config.css.sourceDir)
    if (!fs.existsSync(check)) {
        throw new Error(`error: config.css.sourceDir ${check} doesn't seem to exist!`);
    }

    if (!config.css.targetDir || typeof config.css.targetDir !== "string") {
        config.css.targetDir = "css";
        log("config.css.targetDir set to default " + config.css.targetDir);
    }

    if (typeof config.css.minify !== "boolean" && typeof config.css.minify !== "object") {
        config.css.minify = true;
        log("config.css.minify set to default " + config.css.minify);
    }

    if (!config.css.bundle) {
        config.css.bundle = false;
        log("config.css.bundle set to false, it will be skipped.");
    } else {
        if (typeof config.css.bundle !== "object") {
            config.css.bundle = {result: "default.css", mode: "all", scriptId: "_spa-css"}
            log("config.css.bundle  set to default " + JSON.stringify(config.css.bundle ));
        } else {

            if (typeof config.css.bundle.targetFile !== "string") {
                config.css.bundle.targetFile = "default.css";
                log("config.css.bundle.targetFile set to default " + config.css.bundle.targetFile);
            }

            if (!(config.css.bundle.mode === "all" || (config.css.bundle.mode instanceof Array))) {
                config.css.bundle.mode = "all";
                log("config.css.bundle.mode set to default " + config.css.bundle.mode);
            }

            if (!config.css.bundle.scriptId || typeof config.css.bundle.scriptId !== "string") {
                config.css.bundle.scriptId = "_spa-css";
                log("config.css.scriptId set to default " + config.css.bundle.scriptId)
            }
        }
    }
}

module.exports = {
    parse: config => {

        // root
    
        parseRoot(config);
            
        // index
    
        parseIndex(config);

        // libs
    
        parseLibs(config);

        // css

        parseCss(config);
           
    }
}
