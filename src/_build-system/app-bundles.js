const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");
const appBuilder = require("./app");

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
    const files = configutil.read(appBuilder.configFile);
    if (!files) {
        return;
    }
    const modules = configutil.read(configutil.modulesFile) || {};
    const modulesList = Object.keys(modules);
    
    for (let idx in config.app.bundles) {  
        let bundleFile = config.app.bundles[idx];
        if (!files[bundleFile]) {
            log(`Error: ${bundleFile} couldn't be found in app config ${appBuilder.configFile}, skipping...`);
            continue;
        }
        let bundleConfigName = fileName(idx);

        let result = {
            targetFile: bundleFile,
            includes: modulesList
        }
       
        log(`creating ${bundleConfigName} ...`);
        configutil.write(bundleConfigName, result, false, 
`targetFile: target file relative to app, will be overwritten by this bundle
includes: [] list of modules to bundle - reorder, rearange, remove or add freely - by default all modules are included
`);
    }    
}

module.exports = {
    //build: build,
    configExists: configExists,
    createConfig: createConfig
}
