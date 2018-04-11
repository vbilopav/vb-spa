const fs = require("fs");
const os = require("os");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");
const appBuilder = require("./app");
const libsBuilder = require("./libs");

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

const createConfig = (config, libs, app) => {
    if (!config.app || !config.app.bundles || !config.app.bundles.length) {
        return true;
    }
    const from = path.join(config.targetDir, config.app.targetDir);
    const files = configutil.read(appBuilder.configFile);
    if (!files) {
        return;
    }
    const modulesList = [];
    const modules = {};
    for (let key in libs) {  
        modulesList.push(libs[key].module);
        modules["./" + config.libs.targetDir + "/" + key] = libs[key].module;
    }
    for (let key in app) {  
        modulesList.push(app[key].module);
        modules["./" + config.app.targetDir + "/" + key] = app[key].module;
    }
    for (let idx in config.app.bundles) {  
        let bundleFile = config.app.bundles[idx];        
        if (!files[bundleFile]) {
            log(`Error: ${bundleFile} couldn't be found in app config ${appBuilder.configFile}, skipping...`);
            continue;
        }
        let bundleConfigName = fileName(idx);

        if (fs.existsSync(bundleConfigName)) {
            continue;
        }

        let targetModule;
        let fApp = "./" + config.app.targetDir + "/" + bundleFile;
        let fLibs = "./" + config.libs.targetDir + "/" + bundleFile;
        targetModule = modules[fApp] || modules[fLibs];
        let result = {
            targetFile: bundleFile,
            targetModule: targetModule,
            includes: modulesList,
            replacementExp: null
        }
       
        log(`creating ${bundleConfigName} ...`);
        configutil.write(bundleConfigName, result, false, 
`targetFile: target file relative to app, will be overwritten by this bundle
targetModule: module of target file
includes: [] list of modules to bundle - reorder, rearange, remove or add freely - by default all modules are included
replacementExp: template expression that will return replacement for targetFile module or null to use targetFile content
`);
    }    
}

const build = config => {
    if (!config.app || !config.app.bundles || !config.app.bundles.length) {
        return
    }
    const appDir = path.join(config.targetDir, config.app.targetDir);
    const app = configutil.read(appBuilder.configFile);
    const libs = configutil.read(libsBuilder.configFile);
    const modules = {};
    for (let key in libs) {  
        modules[libs[key].module] = path.join(config.targetDir, path.join(config.libs.targetDir, key.split("/").join(path.sep)));
    }
    for (let key in app) {          
        modules[app[key].module] = path.join(config.targetDir, path.join(config.app.targetDir, key.split("/").join(path.sep)));
    }

    for (let i in config.app.bundles) {        
        let bundle = configutil.read(fileName(i));
        if (!bundle) {
            continue;
        }
        let t = bundle.targetFile.split("/").join(path.sep);
        let bundleTarget = path.join(appDir, t);
        let temp = path.join(os.tmpdir(), t.replace(new RegExp(path.sep, "g"), "-"));
        try{ fs.unlinkSync(temp); } catch (e) {}            
        for (let j in bundle.includes) {
            const moduleId = bundle.includes[j];
            var content;
            if (moduleId === bundle.targetModule && bundle.replacementExp) {
                
                content = configutil.templateStr(bundle.replacementExp, bundle);
            
            } else {
                
                const include = modules[moduleId];                                    
                content = fsutil.readFileSync(include);
                if (!content) {
                    log(`warning: skipping ${moduleId} in bundle ${j}`);
                    continue;                
                }
                content = content.toString();
                
                if (moduleId.startsWith("text!")) {
                
                    content = "define('" + moduleId + "',[],()=> '" + 
                        content.replace(/'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "');" + 
                        os.EOL;
                
                } else if (moduleId.startsWith("template!")) {

                    content = "define('" + moduleId + "',['sys/template-helpers'], helper => { var name = '" + 
                        moduleId + "'.replace('template!', '');  return (data, locale) => helper.parse(name, '" + 
                        content.replace(/'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "', data, locale);});" + 
                        os.EOL;

                } else {

                    content = content.replace("define([", "define('" + moduleId + "',[");
                    content = content + os.EOL;

                }
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
