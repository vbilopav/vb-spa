const fs = require("fs");
const path = require("path");
const os = require('os');

var logContent = "";


const dirname = __dirname;
const splitted = dirname.split(path.sep);
const bellow = splitted.slice(0, splitted.length-1).join(path.sep) + path.sep;

const cleanPath = name => name
    .replace(new RegExp("/", "g"), path.sep)
    .replace(/\.\./g, bellow)
    .replace(/\./g, dirname)
    .replace(new RegExp(path.sep.repeat((path.sep === "/" ? 2 : 4)), "g"), path.sep);

const rootDir = cleanPath("../");

const log = (msg, fileOnly=false) => {
    if (msg) {
        if (typeof msg === "object") {
            msg = msg.message + os.EOL + msg.stack;
        }
        if (rootDir) {
            msg = msg.split(rootDir).join("." + path.sep);
        }
        logContent += new Date().toISOString() + " > " + msg + os.EOL;
    }
    if (!fileOnly) {
        console.log(`build.js > ${msg}`)
    }
};

const dumpLog = file => {
    fs.writeFileSync(file, logContent);
};

const parse = s => {
    try {
        return JSON.parse(s);
    } catch (error) {
        log(error);
        return null;
    }
};

const readFileSync = name => {
    try {
        return fs.readFileSync(name);
    } catch (error) {
        log(error);
        return null;
    }
};

const rmdirSync = pathName => {
    if (fs.existsSync(pathName)) {
        fs.readdirSync(pathName).forEach(function (file, index) {
            var curPath = pathName + path.sep + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                rmdirSync(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(pathName);
    }
};

const mkDirByPathSync = targetDir => {
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
};

const walkSync = function (dir, pathnames, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = filelist || [];
    if (pathnames) {
        pathnames = (pathnames instanceof Array ? pathnames : [pathnames]);
    }
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file) + path.sep, pathnames, filelist);
        }
        else {
            if (!pathnames || !pathnames.length || pathnames.indexOf(path.extname(file)) !== -1) {
                filelist.push({ file: file, dir: dir, full: path.join(dir, file) });
            }
        }
    });
    return filelist;
};

module.exports = {
    cleanPath: cleanPath,
    log: log,
    dumpLog: dumpLog,
    readFileSync: readFileSync,
    parse: parse,
    rmdirSync: rmdirSync,
    mkDirByPathSync: mkDirByPathSync,
    walkSync: walkSync
};
