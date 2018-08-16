(function () {

    var element = document.createElement("div");
    element.id = "loading-screen";
    element.style.display = "none";
    element.style.width = "100%";
    element.style["margin-left"] = "40%";
    element.style["margin-top"] = "10%";
    element.style["font-size"] = "5em";
    document.body.appendChild(element);

    var script = document.createElement("script");
    element.innerHTML = "Detecting features...";
    script.async = true;
    script.src = "libs/feature-detect.js";
    document.head.appendChild(script);

    script.onload = function() {
        for (var feature in Modernizr) {
            if (!Modernizr[feature]) {
                window.location = "/not-supported.html";
                return;
            }
        }
        element.innerHTML = "Loading...";
        setTimeout(function(){element.style.display = ""}, 250);
    };

})();