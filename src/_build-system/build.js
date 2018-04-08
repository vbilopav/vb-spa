const fsutil = require("./fs-util");
const configutil = require("./config");
const fs = require("fs");
const indexBuilder = require("./index");
const libsBuilder = require("./libs");
const cssBuilder = require("./css");

const log = fsutil.log;

var config;

log("");
log("reading user-config.json...");
let defaultConfig = false;
config = configutil.read("user-config.json"); //or arg
if (!config)  {
    log("falling back to reading default-config.json...");
    config = configutil.read("default-config.json");    
    if (!config) {
        log("neither user-config.json or default-config.json couldn't be found, now exiting...");
        return;
    }
    defaultConfig = true;
}   

log("");
log("parsing configuration...");
configutil.parse(config);
if (defaultConfig) {
    log(`creating new config -> ${configutil.configFile("user-config.json")}...`);
    fs.writeFileSync(configutil.configFile("user-config.json"), JSON.stringify(config, null, 4), "utf8");    
}

if (!libsBuilder.configExists() || !cssBuilder.configExists()) {
    log(`Warning: some config files are missing, they will be recretaed first...`);    
    if (!libsBuilder.configExists()) {
        libsBuilder.createConfig(config);
    }
    if (!cssBuilder.configExists()) {
        cssBuilder.createConfig(config);
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

    log("");
    indexBuilder.build(config);
    log("");
    libsBuilder.build(config);
    log("");
    cssBuilder.build(config);

}

log("");
log("finished!");

fsutil.dumpLog(config.targetDir + ".log");
