var fs = require("fs");
var uglify = require("uglify-js");

var result;

result = uglify.minify(fs.readFileSync("./node_modules/requirejs/require.js", "utf8"));

if (result.error) {
    console.log("require.js could not be minified!");
    console.log(result.error);
    return
}

try {
    fs.writeFileSync("./src/libs/require.js", result.code, 'utf8');
} catch (error) {
    console.log("minified require.js could not be written!");
    console.log(error);
    return
}

result = uglify.minify(fs.readFileSync("./node_modules/requirejs-text/text.js", "utf8"));

if (result.error) {
    console.log("text.js could not be minified!");
    console.log(result.error);
    return
}

try {
    fs.writeFileSync("./src/libs/text.js", result.code, 'utf8');
} catch (error) {
    console.log("minified text.js could not be written!");
    console.log(error);
    return
}
