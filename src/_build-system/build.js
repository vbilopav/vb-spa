const
    uglifyEs = require("uglify-es"),
    cleanCss = require("clean-css"),

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




/*
var fs = require("fs");
var uglify = require("uglify-js");

var result;

result = uglify.minify(fs.readFileSync("./node_modules/requirejs/require.js", "utf8"));

if (result.error) {
    console.log("require.js could not be minified!");
    console.log(result.error);
    return
}

try {
    fs.writeFileSync("./src/libs/require.js", result.code, 'utf8');
} catch (error) {
    console.log("minified require.js could not be written!");
    console.log(error);
    return
}

result = uglify.minify(fs.readFileSync("./node_modules/requirejs-text/text.js", "utf8"));

if (result.error) {
    console.log("text.js could not be minified!");
    console.log(result.error);
    return
}

try {
    fs.writeFileSync("./src/libs/text.js", result.code, 'utf8');
} catch (error) {
    console.log("minified text.js could not be written!");
    console.log(error);
    return
}
*/