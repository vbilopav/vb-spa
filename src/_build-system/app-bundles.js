const fs = require("fs");
const os = require("os");
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

const build = config => {
    if (!config.app || !config.app.bundles || !config.app.bundles.length) {
        return
    }
    const appDir = path.join(config.targetDir, config.app.targetDir);
    const modules = configutil.read(configutil.modulesFile) || {};

    for (let i in config.app.bundles) {        
        let bundle = configutil.read(fileName(i));
        if (!bundle) {
            continue;
        }
        let t = bundle.targetFile.split("/").join(path.sep);
        let bundleTarget = path.join(appDir, t);
        let temp = path.join(os.tmpdir(), t);
        fs.unlinkSync(temp);
        for (let j in bundle.includes) {
            const moduleId = bundle.includes[j];
            const include = modules[moduleId].replace("./", config.targetDir + path.sep).split("/").join(path.sep);
            var content = fsutil.readFileSync(include);
            if (!content) {
                log(`warning: skipping ${moduleId} in bundle ${j}`);
                continue;                
            }
            content = content.toString();
            if (moduleId.startsWith("text!") || moduleId.startsWith("template!")) {
                content = "define('" + moduleId + "',[],()=> '" + content.replace(/'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "');" + os.EOL;
            } else {
                content = content.replace("define([", "define('" + moduleId + "',[");
                content = content + os.EOL;
            }
            log(`adding to bundle ${config.app.bundles[i]} module ${moduleId}...`);
            fs.appendFileSync(temp, content);          
        }
        log(`writting bundle ${config.app.bundles[i]} ...`);
        fs.copyFileSync(temp, bundleTarget);
    }
}

module.exports = {
    build: build,
    configExists: configExists,
    createConfig: createConfig
}