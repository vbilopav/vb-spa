const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");

const log = fsutil.log;

const configExists = config => {
    if (!config.app || !config.app.bundles || !config.app.bundles.length) {
        return true;
    }
    for (let idx in config.app.bundles) {
        if (!fs.existsSync(configutil.configFile("bundle-" + idx + ".json"))) {
            return false;
        }
    }
    return true;
}

const createConfig = config => {
    if (!config.app || !config.app.bundles || !config.app.bundles.length) {
        return true;
    }
    for (let idx in config.app.bundles) {  
        /*
        for (let i in files) {
            let fileObj = files[i];
            let file = fileObj.full.replace(from + path.sep, "");
            file = file.split(path.sep).join("/");
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
        */
    }
}

module.exports = {
    //build: build,
    configExists: configExists,
    createConfig: createConfig
}
