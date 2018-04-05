const
    fs = require("./fs-util"),
    path = fs.path,
    sep = fs.sep,    
    log = fs.log,
    splitted = __dirname.split(sep);

var 
    autoDirName = new Date().toISOString().replace(/-/g, '').substring(0, 8);

const parse = config => {

    if (!config.sourceDir) {    
        config.sourceDir = splitted.slice(0, splitted.length-1).join(sep) + sep;
        log("config.sourceDir set to default " + config.sourceDir)
    }

    if (!config.buildDir) {    
        config.buildDir =  path.join(config.sourceDir, "build");
        log("config.buildDir set to default " + config.buildDir)
    }

    if (!config.targetDir) {    
        config.targetDir = path.join(config.buildDir, autoDirName)
        log("config.targetDir set to default " + config.targetDir)
    }


/*
    if (!config.index) {
        throw Error("configuration error - index must be object!")
        return
    }
    if (!config.index.file || typeof config.index.file !== "string") {
        config.index.file = "index.html";
        log("config.index.file set to default " + config.index.file)
    }
    if (typeof config.index.copy !== "boolean") {
        config.index.copy = true;
        log("config.index.copy set to default " + config.index.copy)
    }
    
    if (typeof config.index.globalScript !== "object") {
        config.index.globalScript = {id: "_spa-obj", mode: "awlays"};
        log("config.index.minify set to default " + config.index.minify);
    } else {
        if (!config.index.globalScript.id || typeof config.index.globalScript.id !== "string") {
            config.index.globalScript.id = "_spa-obj";
            log("config.index.globalScript.id set to default " + config.index.globalScript.id);
        }
        if (!(["always", "if-not-exists"].includes(config.index.globalScript.mode))) {
            config.index.globalScript.mode = "always";
            log("config.index.globalScript.mode set to default " + config.index.globalScript.mode);
        }
    }
    if (!config.libs) {
        throw Error("configuration error - libs must be object!")
        return
    }
    if (!config.libs.dir || typeof config.libs.dir !== "string") {
        config.libs.dir = "libs" + dirSeparator;
        log("config.libs.dir set to default " + config.libs.dir)
    }
    if (typeof config.libs.minify !== "boolean") {
        config.libs.minify = false;
        log("config.libs.dir set to default " + config.libs.minify)
    }
    if (!config.css) {
        throw Error("configuration error - css must be object!")
        return
    }
    if (!config.css.dir || typeof config.css.dir !== "string") {
        config.css.dir = "css" + dirSeparator;
        log("config.css.dir set to default " + config.css.dir)
    }
    if (typeof config.css.minify !== "boolean") {
        config.css.minify = false;
        log("config.css.dir set to default " + config.css.minify)
    }
    if (!config.css.scriptId || typeof config.css.scriptId !== "string") {
        config.css.scriptId = "_spa-css";
        log("config.css.scriptId set to default " + config.css.scriptId)
    }
    
    if (typeof config.css.bundle !== "object") {
        config.css.bundle = {result: "default.css", mode: "all"};
        log("config.css.bundle set to default " + config.css.bundle);
    } else {
        if (!config.css.bundle.result || typeof config.css.bundle.result  !== "string") {
            config.css.bundle.result  = "default.css";
            log("config.css.bundle.result set to default " + config.css.bundle.result);
        }
        if (config.css.bundle.mode !== "mode" && (!config.css.bundle.result instanceof Array)) {
            config.index.globalScript.mode = "all";
            log("config.css.bundle.mode set to default " + config.css.bundle.mode);
        }
    }
*/
    return config;
}

module.exports = {
    parse: parse
}
