const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");

const log = fsutil.log;

const fileName = idx => configutil.configFile("bundle-" + idx + ".js");

const configExists = config => {
    if (!config.app || !config.app.bundles || !config.app.bundles.length) {
        return true;
    }
    for (let idx in config.app.bundles) {
        if (!fs.existsSync(fileName(idx))) {
            return false;
        }
    }
    return true;
}

const createConfig = config => {
    if (!config.app || !config.app.bundles || !config.app.bundles.length) {
        return true;
    }
    const from = path.join(config.targetDir, config.app.targetDir);
    const files = fsutil.walkSync(from, [".js", ".html"]);

    for (let idx in config.app.bundles) {  
        let bundleFile = config.app.bundles[idx];
        let bundleConfigName = fileName(idx);
        let result = {
            targetFile: bundleFile,
            includes: []
        }
        for (let i in files) {
            let fileObj = files[i];
            let file = fileObj.full.replace(config.targetDir + path.sep, "");
            file = file.split(path.sep).join("/");
            if (file === bundleFile) {
                continue; // add at the end
            }
            result.includes.push({
                source: file,
                module: "..."
            });            
        }
        result.includes.push({
            source: bundleFile,
            module: "..."
        });
        log(`creating ${bundleConfigName} ...`);
        configutil.write(bundleConfigName, result);
    }    
}

module.exports = {
    //build: build,
    configExists: configExists,
    createConfig: createConfig
}
