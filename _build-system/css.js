const cleanCss = require("clean-css");
const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");
const jsdom = require("jsdom");

const log = fsutil.log;
const configFile = configutil.configFile("css.js");
const configExists = () => fs.existsSync(configFile);

const createConfig = config => {
    const from = path.join(config.sourceDir, config.css.sourceDir);
    const to = path.join(config.targetDir, config.css.targetDir);
    const files = fsutil.walkSync(from, ".css");
    const result = {};

    for (let i in files) {
        let fileObj = files[i];
        let file = fileObj.full.replace(from + path.sep, "");
        file = file.split(path.sep).join("/");
        result["'" + file + "'"] = {
            minify: config.css.minify,
        }
    }

    log(`creating "${configFile}" ...`);
    configutil.write(configFile, result, false, 
`{
    'file name relative to css dir': {
        minify: false to copy, true for default minify config or minify options object,
    }
}, ...`);
}

const getSourceFiles = (config, to) => {
    if (!configExists()) {
        log(`"${configFile}" is missing, skipping css processing ...`);
        return {};
    }

    log(`reading "${configFile}" ...`);
    let result = configutil.read(configFile);
    if (!result)  {
        log(`WARNING: "${configFile}" empty, skipping css processing ...`)
        return {};
    }
    for (let name in result) {
        item = result[name];
        item.fileClean = name.split("/").join(path.sep); 
        item.fileFull = path.join(to, item.fileClean); 
        item.dirTo = path.dirname(item.fileFull);
        let createNewDir = !fs.existsSync(item.dirTo);
        if (createNewDir && config.css.bundle) {
            if (config.css.bundle.files === "all" || config.css.bundle.files.indexOf(name) !== -1) {
                createNewDir = false;
            }
        }
        if (createNewDir) {
            log(`creating "${item.dirTo}" ...`)
            fsutil.mkDirByPathSync(item.dirTo);
        }
    }

    return result;
}

const build = config => {
    if (!config.css) {
        return;
    }

    const from = path.join(config.sourceDir, config.css.sourceDir);
    const to = path.join(config.targetDir, config.css.targetDir);

    if (!fs.existsSync(to)) {
        log(`creating "${to}" ...`);
        fsutil.mkDirByPathSync(to);
    }
    
    const files = getSourceFiles(config, to); 
    const bundleList = [];
    const realBundleList = [];
    const overallFiles = [];


    if (config.css.bundle) {
        if (config.css.bundle.files === "all") {
            for (let file in files) {
                bundleList.push(file);
            }
        } else {
            for (let idx in config.css.bundle.files) { 
                let file = config.css.bundle.files[idx];
                bundleList.push(file);
            }
        }
        let bundleFile = path.join(to, config.css.bundle.targetFile);
        for (let idx in bundleList) {
            try{
                let file = bundleList[idx];
                let fileValue = files[file];
                let fromFile = path.join(from, fileValue.fileClean); 
                let content = fs.readFileSync(fromFile, "utf8");
                if (fileValue.minify !== false) {
                    let opts = typeof fileValue.minify === "object" ? fileValue.minify : undefined;
                    log(`minifying "${file}" for bundle "${bundleFile}" ...`);
                    let result = new cleanCss(opts).minify(content);
                    content = result.styles;
                }
                log(`writing bundle "${bundleFile}" segment "${file}" ...`)
                fs.appendFileSync(bundleFile, content);
                realBundleList.push(file);
            } catch (error) {
                log(error);
            }
        }      
        overallFiles.push(config.css.bundle.targetFile);
    }
    
    for (let file in files) {
        let fileValue = files[file];
        let fromFile = path.join(from, fileValue.fileClean);
        let toFile = fileValue.fileFull;

        if (bundleList.indexOf(file) !== -1) {
            continue;
        }
        if (config.css.bundle && file === config.css.bundle.targetFile) {
            log(`WARNING: bundle "${config.css.bundle.targetFile}" will be overwritten. Check your config ...`)
        }
            
        if (fileValue.minify !== false) {
    
            log(`minifying "${fromFile}" ...`);
            let opts = typeof fileValue.minify === "object" ? fileValue.minify : undefined;
            let content = new cleanCss(opts).minify(fs.readFileSync(fromFile, "utf8"));
            fs.writeFileSync(toFile, content.styles, "utf8"); 

        } else {

            log(`copying "${path.join(from, file)}" ...`);
            fs.copyFileSync(path.join(from, file), toFile);

        }
        overallFiles.push(file);
    }

    if (config.css.index) {
        let index = configutil.templateStr(config.css.index.nameExp, config);  
        let fcontent = fs.readFileSync(path.join(config.targetDir, index), "utf8");
        let dom = new jsdom.JSDOM(fcontent);
        let scr = dom.window.document.querySelector("#" + config.css.index.id);
        if (scr) {
            let content =
            scr.innerHTML = '(function () {var u = (window._spa.cssUrl ? window._spa.cssUrl : "") + "/", ' + 
                            'q = window._spa.version ? "?" + require.urlArgs : ""; document.write(';
            for (let idx in overallFiles) {
                let file = overallFiles[idx];
                content = content + `'<link rel="stylesheet" href="' + u + '${file}"' + q + '" />'`;
                if (idx < overallFiles.length - 1) {
                    content = content + " + ";
                }
            } 
            content = content + ");})();";
            scr.innerHTML = content;  
            fs.writeFileSync(path.join(config.targetDir, index), dom.serialize(), "utf8");
            log(`updating header script content "#${scr.id}" of file "${path.join(config.targetDir, index)}" with content "${content}" ...`);
        }
    }
}

module.exports = {
    build: build,
    configExists: configExists,
    configFile: configFile,
    createConfig: createConfig
}
