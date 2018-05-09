const htmlMinifier = require("html-minifier");
const uglifyEs = require("uglify-es");
const uglifyJs = require("uglify-js");
const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");

const log = fsutil.log;
const configFile = configutil.configFile("app.js");
const configExists = () => fs.existsSync(configFile);

const getEngineFromName = name => {
    let ext = path.extname(name);
    if (ext === ".js") {
        return "uglify-es";
    }
    if (ext === ".html") {
        return "html-minifier";
    } 
    throw new Error("Unknown extension, can't set minify engine...");
}

const createConfig = (config, createModuleMap) => {
    const from = path.join(config.sourceDir, config.app.sourceDir);
    const to = path.join(config.targetDir, config.app.targetDir);
    const files = fsutil.walkSync(from, [".js", ".html"]);
    const result = {};
    for (let i in files) {
        let fileObj = files[i];
        let file = fileObj.full.replace(from + path.sep, "");
        file = file.split(path.sep).join("/");
        let engine = config.app.minifyEngine;
        if (engine === "auto") {
            engine = getEngineFromName(fileObj.file);
        }
        result["'" + file + "'"] = {
            minify: config.app.minify,
            minifyInlineHtml: (engine === "html-minifier" || !config.app.minifyInlineHtml ? undefined : true),
            minifyEngine: engine,
            module: configutil.getModule(fileObj.full, file, config)
        }
    }
    log(`creating "${configFile}" ...`);
    configutil.write(configFile, result, false, 
`{
    'file name relative to app dir': {
        minify: false to copy, true for default minify config or minify options object,
        minifyInlineHtml: minify inline html inside js file
        minifyEngine: uglify-es, uglify-js or html-minifier
    }
}, ...`);
    Object.keys(result).forEach(name => {
        result[name.replace(/(')/mg, "")] = result[name];
        delete result[name];
    });
    return result;
}

const getSourceFiles = (config, to) => {
    if (!configExists()) {
        log(`"${configFile}" is missing, skipping app processing ...`);
        return {};
    }

    log(`reading "${configFile}" ...`);
    let result = configutil.read(configFile);
    if (!result)  {
        log(`warning: "${configFile}" empty, skipping app processing ...`)
        return {};
    }            
    for (let name in result) {
        let item = result[name];
        if (item.engine === "auto") {
            item.engine = getEngineFromName(fileObj.file);
        }
        item.fileClean = name.split("/").join(path.sep); 
        item.fileFull = path.join(to, item.fileClean); 
        item.dirTo = path.dirname(item.fileFull);
        if (!fs.existsSync(item.dirTo)) {
            log(`creating "${item.dirTo}" ...`)
            fsutil.mkDirByPathSync(item.dirTo);
        }
    }
    return result;
}

const minifyInlineHtml = (content, htmlMinifyOpts) => {
    const tag = "String.html`";
    var result = "", len = tag.length, from = 0;
    while (true) {
        let i = content.indexOf(tag, from);
        if (i === -1) {
            break;
        }
        let j = content.indexOf("`", i + len);
        if (j === -1) {
            break;
        }        
        let html = htmlMinifier.minify(content.substring(i + len, j), htmlMinifyOpts)
        result = result + content.substring(from, i + len) + html + "`";
        from = j + 1;
    }
    if (from < content.length) {
        result = result + content.substring(from, content.length);
    }
    return result;
}

const build = config => {
    if (!config.app) {
        return;
    }
    
    const from = path.join(config.sourceDir, config.app.sourceDir);
    const to = path.join(config.targetDir, config.app.targetDir);

    if (!fs.existsSync(to)) {
        log(`creating "${to}" ...`);
        fsutil.mkDirByPathSync(to);
    }

    const 
        files = getSourceFiles(config, to);
    
    for (let file in files) {
        let fileValue = files[file];
        let fromFile = path.join(from, fileValue.fileClean);
        let toFile = fileValue.fileFull;
        
        if (fileValue.minify !== false) {
            
            let content = fsutil.readFileSync(fromFile, "utf8");
            if (content == null) {
                continue;
            }
            log(`minifying "${fromFile}" ...`);

            let result;
            let htmlMinifyOpts = typeof fileValue.minify === "object" ? fileValue.minify : config.app.htmlMinifierOptions;
            try {            
                if (fileValue.minifyEngine === "uglify-js") {
                    let opts =  typeof fileValue.minify === "object" ? fileValue.minify : config.app.minifyJsOptions;
                    result = uglifyJs.minify(content.toString(), opts);
                } else if (fileValue.minifyEngine === "uglify-es") {
                    let opts =  typeof fileValue.minify === "object" ? fileValue.minify : config.app.minifyEsOptions;
                    result = uglifyEs.minify(content.toString(), opts);
                } else if (fileValue.minifyEngine === "html-minifier") {
                    result = {
                        code: htmlMinifier.minify(content.toString(), htmlMinifyOpts)
                    }
                }
            } catch (error) {
                result = {error: true};
                log(error);
            }

            if (result.error) {
                log(`WARNING: file "${path.join(from, file)}" could not be minified, copying instead ...`);
                if (result.error != true) {
                    console.log(result.error);
                }
                fs.writeFileSync(fileValue.fileFull, content.toString(), "utf8");
            } else {
                let final;
                if (fileValue.minifyInlineHtml !== false && (fileValue.minifyEngine === "uglify-js" || fileValue.minifyEngine === "uglify-es")) {
                    htmlMinifyOpts = typeof fileValue.minifyInlineHtml === "object" ? fileValue.minifyInlineHtml : htmlMinifyOpts;
                    final = minifyInlineHtml(result.code, htmlMinifyOpts);
                } else {
                    final = result.code;
                }
                fs.writeFileSync(fileValue.fileFull, final, "utf8");
            }

        } else {

            log(`copying "${fromFile}" ...`);
            try {
                fs.copyFileSync(fromFile, toFile);
            } catch (error) {
                log(error);
                continue;
            }

        }
    }
    
}

module.exports = {
    build: build,
    configExists: configExists,
    configFile: configFile,
    createConfig: createConfig
}
