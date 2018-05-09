const fs = require("fs");
const fsutil = require("./fs-util");
const path = require("path");

const log = fsutil.log;
//const splitted = __dirname.split(path.sep);
const cleanPath = fsutil.cleanPath;

const configPath = path.join(__dirname, "_config");
const configFile = name => path.join(configPath, name);

const read = (name, addPath=false) => {
    if (addPath) {
        name = configFile(name);
    }
    try {
        return eval(fs.readFileSync(name).toString())
    } catch (error) {
        log(error.message);
        return null;
    }
};

const write = (name, value, addPath=false, additionalComment="") => {
    if (value.app && value.app.moduleBundles) {
        for (let b in value.app.moduleBundles) {
            value.app.moduleBundles["'" + b + "'"] = value.app.moduleBundles[b];
            delete value.app.moduleBundles[b];
        }
    }
    var json = JSON.stringify(value, null, 4).replace(/\"([^(\")"]+)\":/g,"$1:");
    if (addPath) {
        name = configFile(name);
    }
    let header = `/**********************************************************
***     auto-generated at ${new Date().toISOString()}      ***
***     to re-create delete or run build.js --force     ***
***********************************************************

${additionalComment}
*/
`
    fs.writeFileSync(name, header + "(" + json + ")", "utf8");
};

const validateEngineOpt = value => ["uglify-js", "uglify-es"].indexOf(value) !== -1;
const validateAllEnginesOpt = value => ["auto", "html-minifier", "uglify-js", "uglify-es"].indexOf(value) !== -1;
const templateStr = (s, o) => (s.indexOf("$") !== -1 ? new Function("return `" + s + "`;").call(o) : s);

const getModule = (sourceFile, file, config) => {
    if (path.extname(file) == ".js") {
        file = file.replace(".js", "");
    } else if (path.extname(file) == ".html") { 
        let content = fs.readFileSync(sourceFile);
        if (content.indexOf("${") !== -1) {
            file = "template!" + file;
        } else {
            file = "text!" + file;
        }
    } else {
        file = "text!" + file;
    }
    if (config.app.sysPath) {
        if (file.startsWith(config.app.sysPath)) {
            file = file.replace(config.app.sysPath, "spa");
        }
    }
    return file;
}

const parseRoot = (config, configTmp) => {
    if (!config.sourceDir) {
        config.sourceDir = "../src";
        log(`config.sourceDir set to default "${config.sourceDir}"`);
    }
    configTmp.sourceDir = cleanPath(config.sourceDir);

    if (!fs.existsSync(configTmp.sourceDir)) {
        throw new Error(`error: config.sourceDir ${configTmp.sourceDir} doesn't seem to exist!`);
    }
    //fsutil.setSourceDir(configTmp.sourceDir)

    if (!config.buildDir) {
        config.buildDir =  "../build";
        log(`config.buildDir set to default "${config.buildDir}"`);
    }
    configTmp.buildDir = cleanPath(config.buildDir);
    if (!fs.existsSync(configTmp.buildDir)) {
        log(`creating "${configTmp.buildDir}" ...`)
        fsutil.mkDirByPathSync(configTmp.buildDir);
    }

    if (!config.autoTargetDirExp || typeof config.autoTargetDirExp !== "string") {
        configTmp.autoTargetDirExp = "${new Date().toISOString().replace(/[-T:]/g, '').substring(0, 14)}";
        log(`config.autoTargetDirExp set to default "${configTmp.autoTargetDirExp}"`)
    } else {
        configTmp.autoTargetDirExp = config.autoTargetDirExp;
    }

    if (!config.targetDir) {
        configTmp.targetDirResult = templateStr(config.autoTargetDirExp);
        log(`config.targetDir set to auto "${configTmp.targetDirResult}"`)
    } else {
        configTmp.targetDirResult = config.targetDir;
    }
    

    if (!(typeof config.copy === "string" || (config.copy instanceof Array))) {
        config.copy = "all";
        log(`config.copy set to default "${config.copy}"`);
    }
}

const parseIndex = (config, configTmp) => {
    if (!config.index) {
        config.index = false;
        log("config.index section will be skipped ...");
        return;
    }

    if (!config.index.sourceFile || typeof config.index.sourceFile !== "string") {
        config.index.sourceFile = "index.html";
        log(`config.index.sourceFile set to default ${config.index.sourceFile}`)
    }

    var check = path.join(configTmp.sourceDir, config.index.sourceFile)
    if (!fs.existsSync(check)) {
        throw new Error(`ERROR: config.index.sourceFile "${check}" doesn't seem to exist!`);
    }

    if (!config.index.targetFile || typeof config.index.targetFile !== "string") {
        config.index.targetFile = "index.html";
        log(`config.index.targetFile set to default "${config.index.targetFile}"`);
    }

    if (!config.index.minify) {
        config.index.minify = false;
        log("config.index.minify set to default false, index will be copied ...");
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
        config.index.globalObject === undefined ||
        (config.index.globalObject && typeof config.index.globalObject !== "object")
     ) {
        config.index.globalObject = {
            scriptContainerId: "_spa",
            name: "_spa",
            mode: "always",
            expression: 
                "{version:'${this.scriptsVersion ? this.scriptsVersion : ''}', " +
                "appUrl: '${this.app ? this.app.targetDir : 'app'}', " + 
                "cssUrl: '${this.css ? this.css.targetDir : 'css'}', " + 
                "libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}', " + 
                "sysPath: '${this.app.sysPath ? this.app.sysPath : 'spa'}', " + 
                "settings: {usePreloadedTemplates: false}}"
        };
        log("config.index.globalObject set to default " + JSON.stringify(config.index.globalObject));
    }

    if (config.index.globalObject) {
        let obj = config.index.globalObject;

        if (typeof obj.scriptContainerId !== "string") {
            obj.scriptContainerId = "_spa";
            log("config.index.globalObject.scriptContainerId set to default " + obj.scriptContainerId);
        }
        if (typeof obj.name !== "string") {
            obj.name = "_spa";
            log("config.index.globalObject.name set to default " + obj.name);
        }
        if (["always", "not-exists"].indexOf(obj.mode) === -1) {
            obj.id = "always";
            log("config.index.globalObject.mode set to always. Allowed modes are ['always', 'not-exists'] " + obj.id);
        }
        if (typeof obj.expression !== "string") {
            obj.expression = "window._spa={version:'', appUrl: '${this.app ? this.app.targetDir : 'app'}/', cssUrl: '${this.css ? this.css.targetDir : 'css'}/', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}/', sysPath: '${this.app.sysPath ? this.app.sysPath : 'spa'}', settings: {usePreloadedTemplates: false}};";
            log("config.index.globalObject.expression set to default " + obj.expression);
        }
    }
}

const parseLibsItem = (item, name) => {
    if (typeof item.minify !== "boolean" && typeof item.minify !== "object") {
        item.minify = true;
        log(name + ".minify set to default " + item.minify);
    }

    if (!validateEngineOpt(item.minifyEngine)) {
        item.minifyEngine = "uglify-js";
        log(name + ".minifyEngine set to default " + item.minifyEngine);
        log("minifyEngine options are: uglify-js and uglify-es");
    }
}

const parseLibs = (config, configTmp) => {

    if (!config.libs) {
        config.libs = false;
        log("config.libs section will be skipped! ");
        return;
    }

    if (!config.libs.sourceDir || typeof config.libs.sourceDir !== "string") {
        config.libs.sourceDir = "libs";
        log(`config.libs.sourceDir set to default "${config.libs.sourceDir}"`)
    }

    var check = path.join(configTmp.sourceDir, config.libs.sourceDir)
    if (!fs.existsSync(check)) {
        throw new Error(`ERROR: config.libs.sourceDir ${check} doesn't seem to exist!`);
    }

    if (!config.libs.targetDir || typeof config.libs.targetDir !== "string") {
        config.libs.targetDir = "libs";
        log(`config.libs.targetDir set to default "${config.libs.targetDir}"`);
    }

    parseLibsItem(config.libs, "config.libs");
}

const parseCssItem = (item, name) => {
    if (typeof item.minify !== "boolean" && typeof item.minify !== "object") {
        item.minify = true;
        log(name + ".minify set to default " + item.minify);
    }
}

const parseCss = (config, configTmp) => {

    if (!config.css) {
        config.css = false;
        log("config.css section will be skipped! ");
        return;
    }

    if (!config.css.sourceDir || typeof config.css.sourceDir !== "string") {
        config.css.sourceDir = "css";
        log(`config.css.sourceDir set to default "${config.css.sourceDir}"`)
    }

    var check = path.join(configTmp.sourceDir, config.css.sourceDir)
    if (!fs.existsSync(check)) {
        throw new Error(`error: config.css.sourceDir ${check} doesn't seem to exist!`);
    }

    if (!config.css.targetDir || typeof config.css.targetDir !== "string") {
        config.css.targetDir = "css";
        log(`config.css.targetDir set to default "${config.css.targetDir}"`);
    }

    if (typeof config.css.minify !== "boolean" && typeof config.css.minify !== "object") {
        config.css.minify = true;
        log("config.css.minify set to default " + config.css.minify);
    }
    parseCssItem(config.css, "config.css");

    if (!config.css.bundle) {
        config.css.bundle = false;
        log("config.css.bundle set to false, it will be skipped.");
    } else {
        if (typeof config.css.bundle !== "object") {
            config.css.bundle = {result: "default.css", files: "all", scriptId: "_css"}
            log("config.css.bundle  set to default " + JSON.stringify(config.css.bundle ));
        } else {

            if (typeof config.css.bundle.targetFile !== "string") {
                config.css.bundle.targetFile = "default.css";
                log(`config.css.bundle.targetFile set to default "${config.css.bundle.targetFile}"`);
            }

            if (!(config.css.bundle.files === "all" || (config.css.bundle.files instanceof Array))) {
                config.css.bundle.files = "all";
                log(`config.css.bundle.files set to default "${config.css.bundle.files}"`);
            }

            if (config.css.index && typeof config.css.index !== "object") {
                config.css.index = {name: "${this.index.targetFile}", id: "_css"};
                log(`config.css.index set to default "${config.css.index}"`);
            }

            if (config.css.index && typeof config.css.index.nameExp !== "string") {
                config.css.index.nameExp = "${this.index.targetFile}";
                log(`config.css.index.nameExp set to default "${config.css.index.nameExp}"`);
            }

            if (config.css.index && typeof config.css.index.id !== "string") {
                config.css.index.id = "_css";
                log(`config.css.index.id set to default "${config.css.index.id}"`);
            }
        }
    }
}

const parseAppItem = (item, name) => {
    if (typeof item.minify !== "boolean") {
        item.minify = true;
        log(name + ".minify set to default " + item.minify);
    }

    if (typeof item.minifyInlineHtml !== "boolean") {
        item.minifyInlineHtml = true;
        log(name + ".minifyInlineHtml set to default " + item.minifyInlineHtml);
    }

    if (!validateAllEnginesOpt(item.minifyEngine)) {
        item.minifyEngine = "auto";
        log(name + ".minifyEngine set to default " + item.minifyEngine);
        log("minifyEngine options are: auto, html-minifier, uglify-js and uglify-es");
    }  

    if (item.minifyJsOptions && typeof item.minifyJsOptions !== "object") {
        item.minifyJsOptions = undefined;
        log(name + ".minifyJsOptions set to default undefined ");
    }
    if (item.minifyJsOptions == null) {
        item.minifyJsOptions = undefined;
    }

    if (item.minifyEsOptions && typeof item.minifyJsOptions !== "object") {
        item.minifyEsOptions = undefined;
        log(name + ".minifyEsOptions set to default undefined ");
    }
    if (item.minifyEsOptions == null) {
        item.minifyEsOptions = undefined;
    }

    if (typeof item.htmlMinifierOptions !== "object") {
        item.htmlMinifierOptions = {
            minifyJS: true, 
            minifyCSS: true, 
            removeAttributeQuotes: true, 
            removeComments: true, 
            removeEmptyAttributes: true, 
            collapseWhitespace: true
        };
        log(name + ".htmlMinifierOptions set to default " + JSON.stringify(item.htmlMinifierOptions));
    }
}

const parseApp = (config, configTmp) => {

    if (!config.app) {
        config.app = false;
        log("config.app section will be skipped! ");
        return;
    }

    if (!config.app.sourceDir || typeof config.app.sourceDir !== "string") {
        config.app.sourceDir = "app";
        log(`config.app.sourceDir set to default "${config.app.sourceDir}"`)
    }

    var check = path.join(configTmp.sourceDir, config.app.sourceDir)
    if (!fs.existsSync(check)) {
        throw new Error(`ERROR: config.app.sourceDir "${check}" doesn't seem to exist!`);
    }

    if (!config.app.targetDir || typeof config.app.targetDir !== "string") {
        config.app.targetDir = "app";
        log(`config.app.targetDir set to default "${config.app.targetDir}"`);
    }

    parseAppItem(config.app, "config.app");

    if (typeof config.app.moduleBundles !== "object") {
        config.app.moduleBundles = {};
        log("config.app.moduleBundles set to default empty object");
    }
}

module.exports = {
    parse: (config, configTmp) => {
        parseRoot(config, configTmp);
        parseIndex(config, configTmp);
        parseLibs(config, configTmp);
        parseCss(config, configTmp);
        parseApp(config, configTmp);
    },
    configFile: configFile,
    read: read,
    write: write,
    parseLibsItem: parseLibsItem,
    parseCssItem: parseCssItem,
    parseAppItem: parseAppItem,
    templateStr: templateStr,
    getModule: getModule
}
