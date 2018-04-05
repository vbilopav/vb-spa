const
    uglify = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),  
    fsutil = require("./fs-util"),  
    log = fsutil.log;

module.exports = {
    build: config => {
        
        if (!config.libs) {
            return;
        }

        let 
            from = path.join(config.sourceDir, config.libs.sourceDir),
            to = path.join(config.targetDir, config.libs.targetDir),
            files = dir(from, ".js");
        let opts;


        if (!fs.existsSync(to)) {
            log(`creating ${to} ...`)
            fsutil.mkDirByPathSync(to);
        }

        if (typeof config.libs.minify === "object") {
            opts = config.libs.minify
        }
        for (let i in files) {
            let file = files[i];
            let content = fs.readFileSync(path.join(from, file), "utf8");
            if (config.libs.minify) {                
                log(`minifying ${path.join(from, file)} ...`);
                if (opts) {
                    result = uglify.minify(content, opts);
                } else {
                    result = uglify.minify(content);
                }
                if (result.error) {
                    log(`warning: file ${path.join(from, file)} could not be minified, copying instead...`);
                    console.log(result.error);
                    fs.writeFileSync(path.join(to, file), content, "utf8");
                } else {                    
                    fs.writeFileSync(path.join(to, file), result.code, "utf8");
                }
            } else {
                log(`copying ${path.join(from, file)} ...`);
                fs.copyFileSync(path.join(from, file), path.join(to, file));                
            }
        }
    }
}
    