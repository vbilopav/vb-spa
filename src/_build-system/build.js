const fsutil = require("./fs-util");
const configutil = require("./config");
const fs = require("fs");
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
        !appBuilder.configExists()
        
        //|| !bundlerBuilder.configExists(config)

    ) {
        
        log(`Warning:  *** some config files are missing, they will be recretaed first, so you may want rerun build!!! ***`);
        
        configutil.touchModulesFile();

        if (!libsBuilder.configExists()) {
            libsBuilder.createConfig(config);
        }
        if (!cssBuilder.configExists()) {
            cssBuilder.createConfig(config);
        }
        if (!appBuilder.configExists()) {
            appBuilder.createConfig(config);
        }
        /*
        if (!bundlerBuilder.configExists(config)) {
            bundlerBuilder.createConfig(config);
        }
        */
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

        log("");
        indexBuilder.build(config);
        log("");
        libsBuilder.build(config);
        log("");
        cssBuilder.build(config);
        log("");
        appBuilder.build(config);
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
