const
    uglifyEs = require("uglify-es"),  
    uglifyJs = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),
    fsutil = require("./fs-util"),
    configutil = require("./config"),
    log = fsutil.log;

const getSourceFiles = (config, from, to) => {
    let jsonFile = configutil.configFile("libs.json");    
    if (fs.existsSync(jsonFile)) {
        log(`reading ${jsonFile} ...`);
        let content = fsutil.readFileSync(jsonFile);
        if (!content)  {
            log(`${jsonFile} empty, skipping libs processing ...`)
            return {};
        }        
        let result = fsutil.parse(content);
        for (let item in result) {
            configutil.parseLibsItem(result[item], item);
        }
        for (let i in result) {
            let dir = path.dirname(path.join(to, i));
            if (!fs.existsSync(dir)) {
                log(`creating ${dir} ...`)
                fsutil.mkDirByPathSync(dir);
            }
        }
        return result;
    }

    let files = walkSync(from, ".js"),
        result = {};

    for (let i in files) {
        let fileObj = files[i];
        let file = fileObj.full.replace(from + path.sep, "");
        if (file !== fileObj.file) {
            let newDir = path.join(to, fileObj.dir.replace(from, ""));
            if (!fs.existsSync(newDir)) {
                log(`creating ${newDir} ...`)
                fsutil.mkDirByPathSync(newDir);
            }
        }
        result[file] = {
            minify: config.libs.minify,
            minifyEngine: config.libs.minifyEngine,
        }
    }
    log(`creating ${jsonFile} ...`);
    fs.writeFileSync(jsonFile, JSON.stringify(result, null, 4), "utf8");    
    return result;
}

module.exports = {
    build: config => {
        
        if (!config.libs) {
            return;
        }

        let 
            from = path.join(config.sourceDir, config.libs.sourceDir),
            to = path.join(config.targetDir, config.libs.targetDir),
            files = getSourceFiles(config, from, to);
            
        if (!fs.existsSync(to)) {
            log(`creating ${to} ...`)
            fsutil.mkDirByPathSync(to);
        }

        
        for (let file in files) {
            let fileValue = files[file];                        
            
            if (fileValue.minify !== false) {
                
                let content = fs.readFileSync(path.join(from, file), "utf8");    
                log(`minifying ${path.join(from, file)} ...`);
                let result;
                if (fileValue.minifyEngine === "uglify-js") {
                    result = uglifyJs.minify(content, fileValue.minify);
                } else {
                    result = uglifyEs.minify(content, fileValue.minify);
                }                    

                if (result.error) {
                    log(`warning: file ${path.join(from, file)} could not be minified, copying instead...`);
                    console.log(result.error);
                    fs.writeFileSync(path.join(to, file), content, "utf8");
                } else {                    
                    fs.writeFileSync(path.join(to, file), result.code, "utf8");
                }

            } else {

                log(`copying ${path.join(from, file)} ...`);
                fs.copyFileSync(path.join(from, file), path.join(to, file));  

            }ž
            
        }
        
    }    
}

    