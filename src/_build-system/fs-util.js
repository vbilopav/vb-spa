var logContent = "";

const 
    fs = require("fs");
    path = require("path"),   
    os = require('os'),
    log = msg => {           
        logContent = logContent + new Date().toISOString()+  " > " + msg + os.EOL;
        console.log(`build.js > ${msg}`)
    },
    dumpLog = file => {
        fs.writeFileSync(file, logContent);
    }
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
    },
    walkSync = function(dir, pathnames, filelist) {
        var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
        var filelist = filelist || [];
        if (pathnames) {
            pathnames = (pathnames instanceof Array ? pathnames : [pathnames]);
        }
        files.forEach(function(file) {        
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filelist = walkSync(path.join(dir, file) + path.sep, pathnames, filelist);
            }
            else {
                if (!pathnames || pathnames.indexOf(path.extname(file)) !== -1) {
                    filelist.push({file: file, dir: dir, full: path.join(dir, file)});
                }
            }            
        });
        return filelist;
      };


module.exports = {
    log: log,
    dumpLog: dumpLog,
    readFileSync: readFileSync,
    parse: parse,
    rmdirSync: rmdirSync, 
    mkDirByPathSync: mkDirByPathSync,
    dir: dir,
    walkSync: walkSync
};
