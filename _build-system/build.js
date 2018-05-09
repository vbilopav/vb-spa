if (process.argv.indexOf("--help") !== -1 || process.argv.indexOf("-h") !== -1) {
    console.log(
`Usage: node build.js [options]

Options:
  -a, --app                  recreate _config/app.js configuration file
  -l, --libs                 recreate _config/libs.js configuration file
  -c, --css                  recreate _config/css.js configuration file
  -b, --bundles              recreate all bundle configuration files in _config dir
  -f, --force                force recreate all configuration files in _config dir
  -t=str, --target=str       set target dir inside build dir, or set target dir expession (same as autoTargetDirExp config)
  -c=str, --config=str       set user config file that will be used or created from default-config.js (default is user-config.js)
`)
    return;
}

const fs = require("fs");
const path = require("path");
const configutil = require("./config");
const fsutil = require("./fs-util");
const indexBuilder = require("./index");
const libsBuilder = require("./libs");
const cssBuilder = require("./css");
const appBuilder = require("./app");
const bundlerBuilder = require("./module-bundles");

var recrateApp = (process.argv.indexOf("--app") !== -1 || process.argv.indexOf("-a") !== -1);
var recrateLibs = (process.argv.indexOf("--libs") !== -1 || process.argv.indexOf("-l") !== -1);
var recrateCss = (process.argv.indexOf("--css") !== -1 || process.argv.indexOf("-c") !== -1);
var recrateBundles = (process.argv.indexOf("--bundles") !== -1 || process.argv.indexOf("-b") !== -1);
const recrateAll = (process.argv.indexOf("--force") !== -1 || process.argv.indexOf("-f") !== -1);

if (recrateAll) {
    recrateApp = true;
    recrateLibs = true;
    recrateCss = true;
    recrateBundles = true;
}

const log = fsutil.log;
var config;
var configTmp = {};
var targetDirArg;
var userConfig = "user-config.js";
var defaultConfigName = "default-config.js";

process.argv.forEach(val => {
    if (val.startsWith("--target=") || val.startsWith("-t=")) {
        targetDirArg = val.split("=")[1];
    }
    if (val.startsWith("--config=") || val.startsWith("-c=")) {
        userConfig = val.split("=")[1];
    }
});

try {

    log("");
    log(`reading "${userConfig}" ...`);
    let defaultConfig = false;
    config = configutil.read(userConfig, true);
    if (!config)  {
        log(`falling back to reading "${defaultConfigName}" ...`);
        config = configutil.read(path.join(__dirname, defaultConfigName), false);
        if (!config) {
            log(`ERROR: neither "${userConfig}" or ${defaultConfigName}" couldn't be found, now exiting ...`);
            return;
        }
        defaultConfig = true;
    }
    if (targetDirArg) {
        config.autoTargetDirExp = targetDirArg;
        console.log(`INFO: autoTargetDirExp set to "${config.autoTargetDirExp}"`);
        config.targetDir = null;
    }

    log("");
    log("parsing configuration ...");
    configutil.parse(config, configTmp);

    if (defaultConfig || targetDirArg) {
        log(`creating new config -> "${configutil.configFile(userConfig)}" ...`);
        configutil.write(userConfig, config, true);
        log(`INFO: copy of "${defaultConfigName}" with name "${configutil.configFile(userConfig)}" has been successufuly created for you.`);
        log("WARNING: You may want to run build again to use that configuration.");
        return;
    }

    config.sourceDir = configTmp.sourceDir;
    config.buildDir = configTmp.buildDir;
    config.targetDir = configTmp.targetDir;
    config.autoTargetDirExp = configTmp.autoTargetDirExp;
    config.targetDir = path.join(config.buildDir, configTmp.targetDirResult);

    let libs, app;
    if (recrateLibs) {
        log(`force recreating "${libsBuilder.configFile}" ...`);
        libs = libsBuilder.createConfig(config);
    }
    if (recrateCss) {
        log(`force recreating "${cssBuilder.configFile}" ...`);
        cssBuilder.createConfig(config);
    }
    if (recrateApp) {
        log(`force recreating "${appBuilder.configFile}" ...`);
        app = appBuilder.createConfig(config);
    }
    if (recrateBundles) {
        log(`force recreating all bundle files ...`);
        bundlerBuilder.createConfig(config);
    }
    
    if (!libsBuilder.configExists() ||
        !cssBuilder.configExists() ||
        !appBuilder.configExists() ||
        !bundlerBuilder.configExists(config)
    ) {

        log(`WARNING:  *** some config files are missing, they will be recreated first, so you may want rerun build!!! ***`);

        if (!libsBuilder.configExists()) {
            libs = libsBuilder.createConfig(config);
        }
        if (!cssBuilder.configExists()) {
            cssBuilder.createConfig(config);
        }
        if (!appBuilder.configExists()) {
            app = appBuilder.createConfig(config);
        }
        if (!bundlerBuilder.configExists(config)) {
            bundlerBuilder.createConfig(config, libs, app);
        }

    } else {

        log("");
        if (fs.existsSync(config.targetDir)) {
            log(`destroying "${config.targetDir}" ...`);
            fsutil.rmdirSync(config.targetDir);
        }
        log(`creating "${config.targetDir}" ...`);
        fsutil.mkDirByPathSync(config.targetDir);

        let fileMask;
        if (config.copy === "all") {
            fileMask = [];
        } else if (typeof config.copy === "string") {
            fileMask = config.copy;
        }
        const files = fsutil.walkSync(config.sourceDir, fileMask);
        for (let i in files) {
            let fileObj = files[i];
            if (fileObj.dir.indexOf("_build-system") !== -1) {
                continue;
            }
            if (config.app && fileObj.full.startsWith(path.join(config.sourceDir, config.app.sourceDir))) {
                continue;
            }
            if (config.libs && fileObj.full.startsWith(path.join(config.sourceDir, config.libs.sourceDir))) {
                continue;
            }
            if (config.css && fileObj.full.startsWith(path.join(config.sourceDir, config.css.sourceDir))) {
                continue;
            }
            if (config.index && (fileObj.file === config.index.sourceFile || fileObj.file === config.index.targetFile)) {
                continue;
            }
            if (config.copy instanceof Array) {
                let f = "./" + fileObj.full.replace(config.sourceDir, "").split(path.sep).join("/");
                if (config.copy.indexOf(f) === -1) {
                    continue
                }
            }
            let targetFile = path.join(config.targetDir, fileObj.full.replace(config.sourceDir, ""));
            let targetDir = path.dirname(targetFile);
            if (!fs.existsSync(targetDir)) {
                log(`creating "${targetDir}" ...`)
                fsutil.mkDirByPathSync(targetDir);
            }

            log(`copying "${targetFile}" ...`);
            try {
                fs.copyFileSync(fileObj.full, targetFile);
            } catch (error) {
                log(error);
                continue;
            }

        }

        log("");
        indexBuilder.build(config);
        log("");
        libsBuilder.build(config);
        log("");
        cssBuilder.build(config);
        log("");
        appBuilder.build(config);
        log("");
        bundlerBuilder.build(config);
    }

    log("");
    log("finished!");
    
    fsutil.dumpLog(config.targetDir + ".log"); 

} catch (error) {

    log(error, true);
    log("ERROR: finished prematurely due the unhandled exceptions!!!");
    fsutil.dumpLog(config.targetDir + ".log");

    throw error;
}
