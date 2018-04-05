const
    htmlMinifier = require("html-minifier"),
    uglifyJs = require("uglify-js"),
    uglifyEs = require("uglify-es"),
    cleanCss = require("clean-css"),
    jsdom = require("jsdom");
    fs = require("./fs-util"),
    configUtil = require("./config"),
    log = fs.log;

var config;

log("reading configuration.json...");
config = fs.read("default-config.json");
if (!config)  {
    return;
}   
log("parsing configuration...");

config = configUtil.parse(config);

log("running on configuration: " + JSON.stringify(config, null, 4));
log("****************************************************************************");
log(configUtil.buildDir)
log(configUtil.targetDir);

log("finished!");

/*
if (fs.existsSync(config.targetDir)) {
    log(`removing ${config.targetDir} ...`)
    rmdirSync(config.targetDir);    
} 
log(`creating ${config.targetDir} ...`)
mkDirByPathSync(config.targetDir);
*/

//log("finished!");
/*
if (copyIndex) {
    var targetIndexHtml = targetDir + "/" + indexHtml.split('/').pop();
    if (minifyIndex) {
        //var htmlMinifier = require("html-minifier"),
        var result = htmlMinifier.minify(fs.readFileSync(indexHtml, "utf8"), {
                minifyJS: true, 
                minifyCSS: true, 
                removeAttributeQuotes: true, 
                removeComments: true, 
                removeEmptyAttributes: true, 
                collapseWhitespace: true
            });
            fs.writeFileSync(targetIndexHtml, result, 'utf8');
    } else {
        fs.copyFileSync(indexHtml, targetIndexHtml);
    }
}
*/