(function () {

    const 
        scr = document.currentScript;

    const
        dev = eval(scr.getAttribute("data-dev")) === null || true,
        version = scr.getAttribute("data-version") || "",
        appUrl = scr.getAttribute("data-appUrl") || "app",
        cssUrl = scr.getAttribute("data-cssUrl") || "css",
        libsUrl = scr.getAttribute("data-libsUrl") || "libs",
        sysPath = scr.getAttribute("data-sysPath") || "_sys",
        settings = eval("(" + scr.getAttribute("data-settings") + ")") || "{usePreloadedTemplates: false}";

    window._app = {dev: dev, version: version, appUrl: appUrl, cssUrl: cssUrl, libsUrl: libsUrl, sysPath: sysPath, settings: settings};
    
    window.require = {baseUrl: _app.appUrl};
    if (window._app.version) {
        window.require.urlArgs = "v=" + window._app.version;
    }

    const
        attrValue = scr.getAttribute("data-css-files"),
        cssFiles = attrValue !== null ? eval("[" + attrValue + "]") : [];
        
    if (cssFiles.length) {
        // css append
    }

    console.log(require);

    const
        appElementId = scr.getAttribute("data-app-container-id") || "app";
    /* require and execute */

})();