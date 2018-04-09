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

const createConfig = config => {
    const from = path.join(config.sourceDir, config.app.sourceDir);
    const to = path.join(config.targetDir, config.app.targetDir);
    const files = fsutil.walkSync(from, [".js", ".html"]);
    const result = {};
    let modules = configutil.read(configutil.modulesFile) || {};
    Object.keys(modules).forEach(name => {
        modules["'" + name + "'"] = modules[name];
        delete modules[name];
    });

    for (let i in files) {
        let fileObj = files[i];
        let file = fileObj.full.replace(from + path.sep, "");
        file = file.split(path.sep).join("/");
        let engine = config.app.minifyEngine;
        if (engine === "auto") {
            engine = getEngineFromName(fileObj.file);           
        }
        modules["'" +  configutil.getModule(fileObj.full, file, config) + "'"] = {
            source: ("./" + config.app.targetDir + "/" + file)
        }
        result["'" + file + "'"] = {
            minify: config.app.minify,
            minifyEngine: engine
        }
    }
    log(`creating ${configFile} ...`);
    configutil.write(configFile, result, false, 
`{
    'file name relative to app dir': {
        minify: false to copy, true for default minify config or minify options object,
        minifyEngine: uglify-es, uglify-js or html-minifier
    }
}, ...`);
    
    log(`writting ${configutil.modulesFile} ...`);
    configutil.write(configutil.modulesFile, modules, false, 
`{
    'module id': {
        source: source file name relative to target dir                
    }
}, ...`);
}

const getSourceFiles = (config, to) => {    
    if (!configExists()) {
        log(`${configFile} is missing, skipping app processing ...`);
        return {};
    }

    log(`reading ${configFile} ...`);
    let result = configutil.read(configFile);
    if (!result)  {
        log(`warning: ${configFile} empty, skipping app processing ...`)
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
                    let opts =  typeof fileValue.minify === "object" ? fileValue.minify : config.app.minifyJsOptions;
                    result = uglifyJs.minify(content.toString(), opts);
                } else if (fileValue.minifyEngine === "uglify-es") {
                    let opts =  typeof fileValue.minify === "object" ? fileValue.minify : config.app.minifyEsOptions;
                    result = uglifyEs.minify(content.toString(), opts);
                } else if (fileValue.minifyEngine === "html-minifier") {                    
                    let opts =  typeof fileValue.minify === "object" ? fileValue.minify : config.app.htmlMinifierOptions;                    
                    opts = typeof opts === "object" ? opts : undefined;
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
