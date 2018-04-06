const 
    fs = require("fs");
    path = require("path"),
    log = msg => console.log(`build.js > ${msg}`),
    parse = s => {
        try {
            return JSON.parse(s);
        } catch (error) {    
            log(error);
            return null;
        }
    },
    readFileSync = name => {
        try {
            return fs.readFileSync(name);
        } catch (error) {    
            log(error);
            return null;
        }
    },    
    rmdirSync = pathName => {
        if (fs.existsSync(pathName)) {
            fs.readdirSync(pathName).forEach(function(file, index) {
                var curPath = pathName + path.sep + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    rmdirSync(curPath);
                } else { // delete file
                fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(pathName);
        }
    },
    mkDirByPathSync = targetDir => {
        const 
            isRelativeToScript = false,
            sep = path.sep,
            initDir = path.isAbsolute(targetDir) ? sep : '',
            baseDir = isRelativeToScript ? __dirname : '.';
        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);  
            }
            return curDir;
        }, initDir);      
    },
    dir = (pathname, extname) => {
        let result = [];
        fs.readdirSync(pathname).forEach(f => {
            if (path.extname(f) === extname) {
                result.push(f);
            }
        });
        return result;
    }


module.exports = {
    log: log,
    readFileSync: readFileSync,
    parse: parse,
    rmdirSync: rmdirSync, 
    mkDirByPathSync: mkDirByPathSync,
    dir: dir
};
