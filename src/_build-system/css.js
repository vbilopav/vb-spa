const
    cleanCss = require("clean-css"),
    fs = require("fs"),
    path = require("path"),  
    fsutil = require("./fs-util"),  
    log = fsutil.log;

module.exports = {
    build: config => {
        
        if (!config.css) {
            return;
        }

        let 
            from = path.join(config.sourceDir, config.css.sourceDir),
            to = path.join(config.targetDir, config.css.targetDir),
            files = dir(from, ".css"),
            opts = {};

        if (typeof config.css.minify === "object") {
            opts = config.css.minify;
        }

        if (!fs.existsSync(to)) {
            log(`creating ${to} ...`)
            fsutil.mkDirByPathSync(to);
        }

        for (let i in files) {
            let file = files[i];

        }
    }
}
    