const
    uglifyEs = require("uglify-es"),    
    fsutil = require("./fs-util"),
    configUtil = require("./config"),
    fs = require("fs"),
    log = fsutil.log,
    indexBuilder = require("./index"),
    libsBuilder = require("./libs");

var config;

log("reading configuration.json...");
config = fsutil.read("default-config.json"); //or arg
if (!config)  {
    return;
}   
log("parsing configuration...");

configUtil.parse(config);

log("running on configuration: " + JSON.stringify(config, null, 4));
log("****************************************************************************");


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


log("finished!");
