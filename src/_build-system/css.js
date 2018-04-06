const
    cleanCss = require("clean-css"),
    fs = require("fs"),
    path = require("path"),
    fsutil = require("./fs-util"),
    configutil = require("./config"),
    jsdom = require("jsdom"),
    log = fsutil.log;

const getSourceFiles = (config, from) => {
    let jsonFile = configutil.configFile("css.json");    
    if (fs.existsSync(jsonFile)) {
        log(`reading ${jsonFile} ...`);
        let content = fsutil.readFileSync(jsonFile);
        if (!content)  {
            log(`${jsonFile} empty, skipping css processing ...`)
            return {};
        }        
        let result = fsutil.parse(content);
        for (let item in result) {
            configutil.parseCssItem(result[item], item);
        }
        return result;
    }

    let files = dir(from, ".css"),
        result = {};

    for (let i in files) {
        let file = files[i];
        result[file] = {
            minify: config.css.minify,
        }
    }
    log(`creating ${jsonFile} ...`);
    fs.writeFileSync(jsonFile, JSON.stringify(result, null, 4), "utf8");    
    return result;
}


module.exports = {
    build: config => {
        
        if (!config.css) {
            return;
        }

        let
            from = path.join(config.sourceDir, config.css.sourceDir),
            to = path.join(config.targetDir, config.css.targetDir),
            files = getSourceFiles(config, from), 
            bundleList = [],
            overallFiles = [];
            
        if (!fs.existsSync(to)) {
            log(`creating ${to} ...`)
            fsutil.mkDirByPathSync(to);
        }

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
                let file = bundleList[idx];
                let fileValue = files[file];
                let content = fs.readFileSync(path.join(from, file), "utf8");
                if (fileValue.minify !== false) {
                    let opts = typeof fileValue.minify === "object" ? fileValue.minify : undefined;
                    log(`minifying ${file} for bundle ${bundleFile} ...}`)
                    let result = new cleanCss(opts).minify(content);
                    content = result.styles;
                } else
                log(`writing bundle ${bundleFile} segment ${file}`)
                fs.appendFileSync(bundleFile, content);
            }      
            overallFiles.push(config.css.bundle.targetFile);     
        }
        
        for (let file in files) {
            if (bundleList.indexOf(file) !== -1) {
                continue;
            }
            if (config.css.bundle && file === config.css.bundle.targetFile) {
                log(`WARNING: bundle ${config.css.bundle.targetFile} will be overwritten. Check your config...`)
            }

            let fileValue = files[file], toFile = path.join(to, file);            
            if (fileValue.minify !== false) {
        
                log(`minifying ${path.join(from, file)} ...`);                            
                let opts = typeof fileValue.minify === "object" ? fileValue.minify : undefined;
                let content = new cleanCss(opts).minify(fs.readFileSync(path.join(from, file), "utf8"));
                fs.writeFileSync(toFile, content.styles, "utf8"); 
                overallFiles.push(bundleFile);

            } else {

                log(`copying ${path.join(from, file)} ...`);
                fs.copyFileSync(path.join(from, file), toFile);  

            }
            overallFiles.push(file);    
        }

        if (config.css.index) {                        
            let index = configutil.templateStr(config.css.index.name, config);  
            let fcontent = fs.readFileSync(path.join(config.targetDir, index), "utf8");
            let dom = new jsdom.JSDOM(fcontent);
            let scr = dom.window.document.querySelector("#" + config.css.index.id);
            if (scr) {
                let content = 
                scr.innerHTML = `(function () {
                    var u = window._spa.cssUrl ? window._spa.cssUrl : "", q = window._spa.version ? "?" + require.urlArgs : "";
                    document.write(`;       
                for (let idx in overallFiles) { 
                    let file = overallFiles[idx];
                    content = content + `'<link rel="stylesheet" href="' + u + '${file}"' + q + '" />'`;
                    if (idx < overallFiles.length - 1) {
                        content = content + " + \n";
                    }
                } 
                content = content + ");})();";
                scr.innerHTML = content;  
                fs.writeFileSync(index, dom.serialize(), "utf8");
                log(`updating header script content #${scr.id} of file ${path.join(config.targetDir, index)} with content ${content}`);
            }         
        }
    }
}    
