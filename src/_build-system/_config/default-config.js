({
  sourceDir: null,
  buildDir: null,
  targetDir: null,
  autoTargetDirExp: "${new Date().toISOString().replace(/-/g, '').substring(0, 8)}",
  index: {
      sourceFile: "index.html",
      targetFile: "index.html",
      minify: {
          minifyJS: true,
          minifyCSS: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          collapseWhitespace: true
      },
      updateGlobalObjectScript: {
          id: "_spa-obj",
          mode: "always",
          contentExp: "window._spa={version:'', appUrl: '${this.app ? this.app.targetDir : 'app'}/', cssUrl: '${this.css ? this.css.targetDir : 'css'}/', libsUrl: '${this.libs ? this.libs.targetDir : 'libs'}/', settings: {usePreloadedTemplates: false}};"
      }
  },
  libs: {
      sourceDir: "libs",
      targetDir: "libs",
      minify: true,
      minifyJsOptions: null,
      minifyEsOptions: null,
      minifyEngine: "uglify-js"
  },
  css: {
      sourceDir: "css",
      targetDir: "css",
      minify: true,
      bundle: {
          targetFile: "default.css",
          files: "all"
      },
      index: {
          nameExp: "${this.index.targetFile}",
          id: "_spa-css"
      }
  },
  app: {
      sourceDir: "app",
      targetDir: "app",
      minify: true,
      minifyEngine: "auto",
      minifyJsOptions: null,
      minifyEsOptions: null,
      htmlMinifierOptions: {
          minifyJS: true,
          minifyCSS: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          collapseWhitespace: true
      },
      bundles: [
          "main.js"
      ]
  }
})