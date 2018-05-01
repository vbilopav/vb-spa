const htmlMinifier = require("html-minifier");
const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");
const fsutil = require("./fs-util");
const configutil = require("./config");

const log = fsutil.log;

module.exports = {
    build: config => {
        
        if (!config.index) {
            return;
        }

        let 
            from = path.join(config.sourceDir, config.index.sourceFile),
            to = path.join(config.targetDir, config.index.targetFile);

        if (!fs.existsSync(from)) {
            log(`ERROR: file "${from}" doesn't seem to exist, skipping index processing ...`);
            return;
        }

        if (!config.index.minify) {

            log(`Copying from "${from}" to "${to}" ...`);

            try {
                fs.copyFileSync(from, to);
            } catch (error) {
                log(error);
                return;
            }

        } else {

            log(`minifying from "${from}" to "${to}" ...`);
            let opts = typeof config.index.minify === "object" ? config.index.minify : undefined;
            var result = htmlMinifier.minify(fs.readFileSync(from, "utf8"), opts);
            fs.writeFileSync(to, result, "utf8");

        }

        if (!config.index.globalObject) {
            return;
        }
        
        let obj = config.index.globalObject;
        let dom = new jsdom.JSDOM(fs.readFileSync(to, "utf8"));
        let scr = dom.window.document.querySelector("#" + obj.scriptContainerId);
        let content = `window.${obj.name}=${configutil.templateStr(obj.expression, config)};`;
        let changed = false;
        
        if (obj.mode === "always") {
            if (!scr) {
                scr = dom.window.document.createElement("script");
                scr.id = obj.scriptContainerId;
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
            log(`updating header script content "#${obj.scriptContainerId}" of file "${to}" with content "${content}" ...`);
        }
    }
}
