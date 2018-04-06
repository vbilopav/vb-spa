const
    uglify = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),
    fsutil = require("./fs-util"),
    log = fsutil.log;

const getSourceFiles = (config, from) => {
    let jsonFile = path.join(__dirname, "libs.json");    
    if (fs.existsSync(jsonFile)) {
        log(`reading ${jsonFile} ...`);
        let content = fsutil.readFileSync(jsonFile);
        if (!content)  {
            log(`${jsonFile} empty, skipping libs processing ...`)
            return {};
        }        
        return fsutil.parse(content);
    }

    let files = dir(from, ".js"),
        result = {};

    for (let i in files) {
        let file = files[i];
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
            files = getSourceFiles(config, from);
            
        if (!fs.existsSync(to)) {
            log(`creating ${to} ...`)
            fsutil.mkDirByPathSync(to);
        }

        for (let file in files) {
            let fileValue = files[file];                        
            let content = fs.readFileSync(path.join(from, file), "utf8");

            if (fileValue.minify !== false) {
                
                log(`minifying ${path.join(from, file)} ...`);
                result = uglify.minify(content, fileValue.minify);

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

            }
            
        }
    }
}
    