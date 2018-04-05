var fs = require("fs");

fs.copyFileSync("./node_modules/requirejs/require.js", "./src/libs/require.js");
fs.copyFileSync("./node_modules//requirejs-text/text.js", "./src/libs/text.js");
