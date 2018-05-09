const uglifyEs = require("uglify-es");
const uglifyJs = require("uglify-js");
const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");

const log = fsutil.log;
const configFile = configutil.configFile("libs.js");
const configExists = () => fs.existsSync(configFile);

const createConfig = config => {
    const from = path.join(config.sourceDir, config.libs.sourceDir);
    const to = path.join(config.targetDir, config.libs.targetDir);
    const files = fsutil.walkSync(from, ".js");
    const result = {};
    for (let i in files) {
        let fileObj = files[i];
        let file = fileObj.full.replace(from + path.sep, "");
        file = file.split(path.sep).join("/");
        result["'" + file + "'"] = {
            minify: config.libs.minify,
            minifyEngine: config.libs.minifyEngine,
            module: configutil.getModule(fileObj.full, "libs/" + file, config)
        }
    }
    log(`creating "${configFile}" ...`);
    configutil.write(configFile, result, false, 
`{
    'file name relative to libs dir': {
        minify: false to copy, true for default minify config or minify options object,
        minifyEngine: uglify-es, uglify-js,
        module: module id if required inside application
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
        log(`file "${configFile}" is missing, skipping libs processing ...`);
        return {};
    }

    log(`reading "${configFile}" ...`);
    let result = configutil.read(configFile);
    if (!result)  {
        log(`WARNING: "${configFile}" empty, skipping libs processing ...`)
        return {};
    }
    for (let name in result) {
        item = result[name];
        item.fileClean = name.split("/").join(path.sep);
        item.fileFull = path.join(to, item.fileClean);
        item.dirTo = path.dirname(item.fileFull);
        if (!fs.existsSync(item.dirTo)) {
            log(`creating "${item.dirTo}" ...`);
            fsutil.mkDirByPathSync(item.dirTo);
        }
    }
    return result;
}

const build = config => {
    if (!config.libs) {
        return;
    }

    const from = path.join(config.sourceDir, config.libs.sourceDir);
    const to = path.join(config.targetDir, config.libs.targetDir);
                
    if (!fs.existsSync(to)) {
        log(`creating "${to}" ...`);
        fsutil.mkDirByPathSync(to);
    }

    const 
        files = getSourceFiles(config, to);
    
    for (let file in files) {
        let fileValue = files[file];
        let fromFile = path.join(from, fileValue.fileClean);
        
        if (fileValue.minify !== false) {
            
            let content = fsutil.readFileSync(fromFile, "utf8");
            if (content == null) {
                continue;
            }
            log(`minifying "${fromFile}" ...`);

            let result;
            if (fileValue.minifyEngine === "uglify-js") {
                let opts =  typeof fileValue.minify === "object" ? fileValue.minify : config.app.minifyJsOptions;
                result = uglifyJs.minify(content.toString(), opts);
            } else if (fileValue.minifyEngine === "uglify-es") {
                let opts =  typeof fileValue.minify === "object" ? fileValue.minify : config.app.minifyEsOptions;
                result = uglifyEs.minify(content.toString(), opts);
            }

            if (result.error) {
                log(`WARNING: file "${path.join(from, file)}" could not be minified, copying instead ...`);
                console.log(result.error);
                fs.writeFileSync(fileValue.fileFull, content.toString(), "utf8");
            } else {
                fs.writeFileSync(fileValue.fileFull, result.code, "utf8");
            }

        } else {

            log(`copying "${fromFile}" ...`);
            try {
                fs.copyFileSync(fromFile, fileValue.fileFull);
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
