const
    htmlMinifier = require("html-minifier"),    
    jsdom = require("jsdom"),
    fsutil = require("./fs-util"),    
    configutil = require("./config"),
    fs = require("fs"),
    path = require("path"),    
    log = fsutil.log;

module.exports = {
    build: config => {
        
        if (!config.index) {
            return;
        }

        let 
            from = path.join(config.sourceDir, config.index.sourceFile),
            to = path.join(config.targetDir, config.index.targetFile);

        if (!config.index.minify) {

            log(`Copying from ${from} to ${to} ...`);
            fs.copyFileSync(from, to);
        
        } else {

            log(`minifying from ${from} to ${to} ...`);
            let opts = typeof config.index.minify === "object" ? config.index.minify : undefined;
            var result = htmlMinifier.minify(fs.readFileSync(from, "utf8"), opts);
            fs.writeFileSync(to, result, "utf8");

        }

        if (!config.index.updateGlobalObjectScript) {
            return;
        }
        
        var obj = config.index.updateGlobalObjectScript,
            dom = new jsdom.JSDOM(fs.readFileSync(to, "utf8")),
            scr = dom.window.document.querySelector("#" + obj.id),
            content = configutil.templateStr(obj.content, config),
            changed = false;
        
        if (obj.mode === "always") {
            if (!scr) {
                scr = dom.window.document.createElement("script");
                scr.id = obj.id;
                let head = dom.window.document.querySelector("head")
                head.insertBefore(scr, head.firstChild);
            }
            scr.innerHTML = content;
            changed = true;
        } else {
            if (scr) {
                scr.innerHTML = content;
                changed = true;
            }
        }        
        if (changed) {            
            fs.writeFileSync(to, dom.serialize(), "utf8");
            log(`updating header script content #${obj.id} of file ${to} with content ${content}`);
        }        
    }
}
    