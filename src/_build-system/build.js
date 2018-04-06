const      
    fsutil = require("./fs-util"),
    configutil = require("./config"),
    fs = require("fs"),
    log = fsutil.log,
    indexBuilder = require("./index"),
    libsBuilder = require("./libs"),
    cssBuilder = require("./css");

var config;

log("reading user-config.json...");
let defaultConfig = false;
config = configutil.read("user-config.json"); //or arg
if (!config)  {
    log("fallback to user-config.json...");
    config = configutil.read("default-config.json");    
    if (!config) {
        log("user-config.json or default-config.json couldn't be found, now exiting...");
        return;
    }
    defaultConfig = true;
}   
log("parsing configuration...");
configutil.parse(config);
if (defaultConfig) {
    log(`creating new config -> user-config.json...`);
    fs.writeFileSync(configutil.configFile("user-config.json"), JSON.stringify(config, null, 4), "utf8");    
}

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

indexBuilder.build(config);
libsBuilder.build(config);
cssBuilder.build(config);


log("finished!");
