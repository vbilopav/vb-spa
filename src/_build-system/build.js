var 
    fs = require("fs"),
    htmlMinifier = require("html-minifier"),
    uglifyJs = require("uglify-js"),
    uglifyEs = require("uglify-es"),
    cleanCss = require("clean-css"),
    path = require('path'),
    jsdom = require("jsdom");

let 
    dirArray = __dirname.split("/"),
    log = s => console.log(`\n build.js > ${s}`);
    readFile = name => {
        try {
            return fs.readFileSync(name);
        } catch (error) {    
            console.log(error);
            return;
        }
    },
    json = s => {
        try {
            return JSON.parse(s);
        } catch (error) {    
            console.log(error);
            return;
        }
    }

log("reading configuration.json...");
var config = json(readFile(path.join(__dirname, "configuration.json")));
if (!config)  {
    return;
}   
log("parsing configuration...");
if (!config.sourceDir) {    
    config.sourceDir = "./" + dirArray[dirArray.length-2];
    log("config.sourceDir set to default " + config.sourceDir)
}
if (!config.targetDir) {    
    config.targetDir = 
        config.sourceDir + 
        "/" + dirArray[dirArray.length-1] + "/build/" +
        new Date().toISOString().replace(/-/g, '').substring(0, 8)
    log("config.targetDir set to default " + config.targetDir)
}
if (!config.index) {
    throw Error("configuration error - index must be object!")
    return
}
if (!config.index.file || typeof config.index.file !== "string") {
    config.index.file = "index.html";
    log("config.index.file set to default " + config.index.file)
}
if (typeof config.index.copy !== "boolean") {
    config.index.copy = true;
    log("config.index.copy set to default " + config.index.copy)
}
if (typeof config.index.minify !== "boolean") {
    config.index.minify = true;
    log("config.index.minify set to default " + config.index.minify)
}
if (typeof config.index.globalScript !== "object") {
    config.index.globalScript = {id: "_spa-obj", mode: "awlays"};
    log("config.index.minify set to default " + config.index.minify);
} else {
    if (!config.index.globalScript.id || typeof config.index.globalScript.id !== "string") {
        config.index.globalScript.id = "_spa-obj";
        log("config.index.globalScript.id set to default " + config.index.globalScript.id);
    }
    if (!(["always", "if-not-exists"].includes(config.index.globalScript.mode))) {
        config.index.globalScript.mode = "always";
        log("config.index.globalScript.mode set to default " + config.index.globalScript.mode);
    }
}
if (!config.libs) {
    throw Error("configuration error - libs must be object!")
    return
}
if (!config.libs.dir || typeof config.libs.dir !== "string") {
    config.libs.dir = "libs/";
    log("config.libs.dir set to default " + config.libs.dir)
}
if (typeof config.libs.minify !== "boolean") {
    config.libs.minify = false;
    log("config.libs.dir set to default " + config.libs.minify)
}
if (!config.css) {
    throw Error("configuration error - css must be object!")
    return
}
if (!config.css.dir || typeof config.css.dir !== "string") {
    config.css.dir = "css/";
    log("config.css.dir set to default " + config.css.dir)
}
if (typeof config.css.minify !== "boolean") {
    config.css.minify = false;
    log("config.css.dir set to default " + config.css.minify)
}
if (!config.css.scriptId || typeof config.css.scriptId !== "string") {
    config.css.scriptId = "_spa-css";
    log("config.css.scriptId set to default " + config.css.scriptId)
}

if (typeof config.css.bundle !== "object") {
    config.css.bundle = {result: "default.css", mode: "all"};
    log("config.css.bundle set to default " + config.css.bundle);
} else {
    if (!config.css.bundle.result || typeof config.css.bundle.result  !== "string") {
        config.css.bundle.result  = "default.css";
        log("config.css.bundle.result set to default " + config.css.bundle.result);
    }
    if (config.css.bundle.mode !== "mode" && (!config.css.bundle.result instanceof Array)) {
        config.index.globalScript.mode = "all";
        log("config.css.bundle.mode set to default " + config.css.bundle.mode);
    }
}

log("running on configuration: " + JSON.stringify(config));



log("finished!")
/*



 var fs = require("fs");
 console.log("\n *STARTING* \n");
// Get content from file
 var contents = fs.readFileSync("jsoncontent.json");
// Define to JSON type
 var jsonContent = JSON.parse(contents);
// Get Value from JSON
 console.log("User Name:", jsonContent.username);

var 
    version = new Date().toISOString()
        .replace(/T/, '')
        .replace(/\..+/, '')
        .replace(' ', '')
        .replace(/:/g, '')
        .replace(/-/g, '')
        .substring(0, 8)
    indexHtml = "./src/index.html",
    
    copyIndex = true
    minifyIndex = true,
    
    copyLibs = true,
    minifyLibs = true,

    copyCss = true,
    minifyCss = true;
    
var targetDir = "./src/_build-system/build";

//var fs = require("fs"),
var rmdirSync = function(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file, index){
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
}

if (version) {
    targetDir = targetDir  + "/" + version;
    if (fs.existsSync(targetDir)) {
        rmdirSync(targetDir);        
    }
    fs.mkdirSync(targetDir);
}

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