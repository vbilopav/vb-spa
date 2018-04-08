const
    uglifyEs = require("uglify-es"),  
    uglifyJs = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),
    fsutil = require("./fs-util"),
    configutil = require("./config");

const configFile = configutil.configFile("libs.json");
const configExists = () => fs.existsSync(configFile);

const createConfig = config => {
    const from = path.join(config.sourceDir, config.libs.sourceDir);
    const to = path.join(config.targetDir, config.libs.targetDir);
    const files = walkSync(from, ".js");
    const result = {};

    for (let i in files) {
        let fileObj = files[i];
        let file = fileObj.full.replace(from + path.sep, "");
        file = file.split(path.sep).join("/");
        result[file] = {
            minify: config.libs.minify,
            minifyEngine: config.libs.minifyEngine,
        }
    }
    log(`creating ${configFile} ...`);
    fs.writeFileSync(configFile, JSON.stringify(result, null, 4), "utf8");
}

const getSourceFiles = (config, to) => {    
    if (!configExists()) {
        log(`${configFile} is missing, skipping libs processing ...`);
        return {};
    }

    log(`reading ${configFile} ...`);
    let content = fsutil.readFileSync(configFile);
    if (!content)  {
        log(`warning: ${configFile} empty, skipping libs processing ...`)
        return {};
    }        
    let result = fsutil.parse(content);
    for (let name in result) {        
        item = result[name];
        configutil.parseLibsItem(result[name], name);
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
    if (!config.libs) {
        return;
    }

    const from = path.join(config.sourceDir, config.libs.sourceDir);
    const to = path.join(config.targetDir, config.libs.targetDir);
                
    if (!fs.existsSync(to)) {
        log(`creating ${to} ...`)
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
            log(`minifying ${fromFile} ...`);
            let result;
            if (fileValue.minifyEngine === "uglify-js") {
                result = uglifyJs.minify(content.toString(), fileValue.minify);
            } else {
                result = uglifyEs.minify(content.toString(), fileValue.minify);
            }                    

            if (result.error) {
                log(`Warning: file ${path.join(from, file)} could not be minified, copying instead...`);
                console.log(result.error);
                fs.writeFileSync(fileValue.fileFull, content.toString(), "utf8");
            } else {                    
                fs.writeFileSync(fileValue.fileFull, result.code, "utf8");
            }

        } else {

            log(`copying ${fromFile} ...`);
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

    