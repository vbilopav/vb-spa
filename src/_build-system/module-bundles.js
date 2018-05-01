const fs = require("fs");
const os = require("os");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");
const appBuilder = require("./app");
const libsBuilder = require("./libs");

const log = fsutil.log;

const fileName = name => configutil.configFile(
    "bundle-" + name.replace(RegExp("[/.]", "g"), "-") + ".js"
);

const entryPointreplacementExp = "define('${this.targetModule}', [${\"'\" + this.includes.join(\"','\") + \"'\"}], () => { require('app')(); });"

const configExists = config => {
    if (!config.app || !config.app.moduleBundles || !Object.keys(config.app.moduleBundles).length) {
        return true;
    }
    Object.keys(config.app.moduleBundles).forEach(name => {
        if (name.startsWith("'") && name.endsWith("'")) {
            config.app.moduleBundles[name.replace(/(')/mg, "")] = config.app.moduleBundles[name];
            delete config.app.moduleBundles[name];
        }        
    });
    for (let moduleName in config.app.moduleBundles) {
        if (!fs.existsSync(fileName(moduleName))) {
            return false;
        }
    }
    return true;
}

const createConfig = (config, libs, app) => {
    if (!config.app || !config.app.moduleBundles || !Object.keys(config.app.moduleBundles).length) {
        return true;
    }
    const from = path.join(config.targetDir, config.app.targetDir);
    const modulesList = [];
    const modules = {};
    if (!libs) {
        libs = configutil.read(libsBuilder.configFile);
    }
    if (!app) {
        app = configutil.read(appBuilder.configFile);
    }
    for (let key in libs) {
        modulesList.push(libs[key].module);
        modules["./" + config.libs.targetDir + "/" + key] = libs[key].module;
    }
    for (let key in app) {
        modulesList.push(app[key].module);
        modules["./" + config.app.targetDir + "/" + key] = app[key].module;
    }

    for (let bundleName in config.app.moduleBundles) {
        let bundleObj = config.app.moduleBundles[bundleName];
        if (modulesList.indexOf(bundleName) === -1) {
            log(`ERROR: "${bundleName}" couldn't be found in app config "${appBuilder.configFile}", skipping...`);
            continue;
        }

        var includes = bundleObj.includes === "all" ? modulesList : bundleObj.includes;
        if (bundleObj.excludes && bundleObj.excludes.length) {
            bundleObj.excludes.forEach(val => { 
                includes = includes.filter(item => item !== val);
            });
        }

        let result = {
            targetModule: bundleName,
            includes: includes,
            entryPoint: bundleObj.entryPoint,
            replacementExp: bundleObj.entryPoint ? entryPointreplacementExp : undefined
        }
        let bundleConfigName = fileName(bundleName)
        log(`creating "${bundleConfigName}" ...`);
        configutil.write(bundleConfigName, result, false,
`targetModule: target module which will be replace by this bundle
includes: [] list of modules to bundle
`);

    }
}

const build = config => {
    if (!config.app || !config.app.moduleBundles || !Object.keys(config.app.moduleBundles).length) {
        return true;
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

    for (let bundleName in config.app.moduleBundles) {
        let bundle = configutil.read(fileName(bundleName));
        if (!bundle) {
            continue;
        }

        let bundleTarget = modules[bundle.targetModule];
        let temp = path.join(os.tmpdir(), bundle.targetModule.replace(new RegExp("/", "g"), "-"));
        try{ fs.unlinkSync(temp); } catch (e) {}

        for (let j in bundle.includes) {
            const moduleId = bundle.includes[j];
            var content;
            if (moduleId === bundle.targetModule && bundle.replacementExp) {
                
                content = configutil.templateStr(bundle.replacementExp, bundle) + os.EOL;

            } else {

                const include = modules[moduleId];
                content = fsutil.readFileSync(include);
                if (!content) {
                    log(`WARNING: skipping module "${moduleId}" in bundle "${j}" ...`);
                    continue;
                }
                content = content.toString();
                
                if (moduleId.startsWith("text!")) {

                    content = "define('" + moduleId + "',[],()=> '" + 
                        content.replace(/'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "');" + 
                        os.EOL;
                
                } else if (moduleId.startsWith("template!")) {

                    content = "define('" + moduleId + "',['" + config.app.sysPath + "/template-helpers'], helper => { var name = '" + 
                        moduleId + "'.replace('template!', '');  return (data, locale) => helper.parse(name, '" + 
                        content.replace(/'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "', data, locale);});" + 
                        os.EOL;

                } else {

                    content = content.replace("define([", "define('" + moduleId + "',[");
                    content = content + os.EOL;

                }
            }

            log(`adding to bundle "${bundleName}" module "${moduleId}" ...`);
            fs.appendFileSync(temp, content);
        }
        log(`writting bundle file "${bundleTarget}" ...`);
        fs.copyFileSync(temp, bundleTarget);
    }

}

module.exports = {
    build: build,
    configExists: configExists,
    createConfig: createConfig
}
