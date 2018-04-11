const fs = require("fs");
const path = require("path");
const configutil = require("./config");
const fsutil = require("./fs-util");
const indexBuilder = require("./index");
const libsBuilder = require("./libs");
const cssBuilder = require("./css");
const appBuilder = require("./app");
const bundlerBuilder = require("./app-bundles");

const log = fsutil.log;

var config;

try {

    log("");
    log("reading user-config.js...");
    let defaultConfig = false;
    config = configutil.read("user-config.js", true); //or arg
    if (!config)  {
        log("falling back to reading default-config.js...");
        config = configutil.read("default-config.js", true);    
        if (!config) {
            log("neither user-config.js or default-config.js couldn't be found, now exiting...");
            return;
        }
        defaultConfig = true;
    }   

    log("");
    log("parsing configuration...");
    configutil.parse(config);
    if (defaultConfig) {
        log(`creating new config -> ${configutil.configFile("user-config.js")}...`);  
        configutil.write("user-config.js", config, true, "copy of default-config.js");
    }

    if (!libsBuilder.configExists() || 
        !cssBuilder.configExists() || 
        !appBuilder.configExists() || 
        !bundlerBuilder.configExists(config)
    ) {
        
        log(`Warning:  *** some config files are missing, they will be recretaed first, so you may want rerun build!!! ***`);
        
        var createModuleMap = false;
        if (!fs.existsSync(configutil.modulesFile)) {
            configutil.touchModulesFile();
            createModuleMap = true;
        }
        if (!libsBuilder.configExists()) {
            libsBuilder.createConfig(config, createModuleMap);
        }
        if (!cssBuilder.configExists()) {
            cssBuilder.createConfig(config);
        }
        if (!appBuilder.configExists()) {
            appBuilder.createConfig(config, createModuleMap);
        }        
        if (!bundlerBuilder.configExists(config)) {
            bundlerBuilder.createConfig(config);
        }
        
    } else {
        
        log("");
        if (!fs.existsSync(config.buildDir)) {
            log(`creating ${config.buildDir} ...`)
            fsutil.mkDirByPathSync(config.buildDir);
        }

        if (fs.existsSync(config.targetDir)) {
            log(`destroying ${config.targetDir} ...`)
            fsutil.rmdirSync(config.targetDir);    
        }
        log(`creating ${config.targetDir} ...`)
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
                log(`creating ${targetDir} ...`)
                fsutil.mkDirByPathSync(targetDir);
            }

            log(`copying ${targetFile} ...`);
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
    log("finished prematurely due the exception!!!");    
    fsutil.dumpLog(config.targetDir + ".log");    

    throw error;
}
