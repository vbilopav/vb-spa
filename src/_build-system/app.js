const htmlMinifier = require("html-minifier");
const uglifyEs = require("uglify-es");
const uglifyJs = require("uglify-js");
const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");

const log = fsutil.log;
const configFile = configutil.configFile("app.json");
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

const createConfig = config => {
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
        result[file] = {
            minify: config.app.minify,
            minifyEngine: engine,
            minifyJsOptions: config.app.minifyJsOptions ? config.app.minifyJsOptions : null,
            minifyEsOptions: config.app.minifyEsOptions ? config.app.minifyEsOptions : null,
            htmlMinifierOptions: config.app.htmlMinifierOptions
        }
    }
    log(`creating ${configFile} ...`);
    fs.writeFileSync(configFile, JSON.stringify(result, null, 4), "utf8");
}

const getSourceFiles = (config, to) => {    
    if (!configExists()) {
        log(`${configFile} is missing, skipping app processing ...`);
        return {};
    }

    log(`reading ${configFile} ...`);
    let content = fsutil.readFileSync(configFile);
    if (!content)  {
        log(`warning: ${configFile} empty, skipping app processing ...`)
        return {};
    }        
    let result = fsutil.parse(content);
    for (let name in result) {        
        item = result[name];
        configutil.parseAppItem(item, name);
        if (item.engine === "auto") {
            item.engine = getEngineFromName(fileObj.file);
        }
        item.fileClean = name.split("/").join(path.sep); 
        item.fileFull = path.join(to, item.fileClean); 
        item.dirTo = path.dirname(item.fileFull);
        if (!fs.existsSync(item.dirTo)) {
            log(`creating ${item.dirTo} ...`)
            fsutil.mkDirByPathSync(item.dirTo);
        }
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
        log(`creating ${to} ...`);
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
            log(`minifying ${fromFile} ...`);

            let result;
            try {            
                if (fileValue.minifyEngine === "uglify-js") {
                    result = uglifyJs.minify(content.toString(), fileValue.minifyJsOptions);
                } else if (fileValue.minifyEngine === "uglify-es") {
                    result = uglifyEs.minify(content.toString(), fileValue.minifyEsOptions);
                } else if (fileValue.minifyEngine === "html-minifier") {
                    let opts = typeof fileValue.htmlMinifierOptions === "object" ? fileValue.htmlMinifierOptions : undefined;
                    result = {
                        code: htmlMinifier.minify(content.toString(), opts) 
                    }                
                }
            } catch (error) {
                result = {error: true};
                log(error);
            }

            if (result.error) {
                log(`Warning: file ${path.join(from, file)} could not be minified, copying instead...`);
                if (result.error != true) {
                    console.log(result.error);
                }                
                fs.writeFileSync(fileValue.fileFull, content.toString(), "utf8");
            } else {                    
                fs.writeFileSync(fileValue.fileFull, result.code, "utf8");
            }

        } else {

            log(`copying ${fromFile} ...`);
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
