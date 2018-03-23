define([], () => { 
    
    String.prototype._clearHashbang = function() { 
        return this.replace(/^(#)/, "").replace(/^(!)/, "");
    }

    String.prototype._extractParams = function() { 
        return this.split("/").filter(element => element)
    }

    _getHashData = (route, hash=document.location.hash) => {
        let clear = hash._clearHashbang();
        if (!clear.startsWith(route) || (route === "" && clear !== "")) {
            return
        }
        clear = clear.replace(route, "");
        return {
            route: route,
            params: clear._extractParams()
        };
    }

    class Router  {
        constructor(options) {
            this._options = options;
            this._routes = options.routes;
            this._navigate = options.navigate;
            this._leave = options.leave;
        }
    }

    Router.prototype._handleView = function (route, data, hashData) {
        require([data.view], (view) => {
            let template;
            if (typeof view === "string") {
                template = view;
            } else if (typeof view === "function") {
                if (data.view.startsWith("template!")) {
                    template = view(hashData.params);
                } else {
                    let instance = new view(...hashData.params);
                    template = view.render();
                }                        
            } else if (typeof view === "object") {
                view.init(...hashData.params);
                template = view.render();
            }
            if (this._navigate) {
                this._navigate({route: route, data: data, view: view, template: template, params: hashData.params});
            }                    
        })
    }

    Router.prototype._triggerLeave = function (oldURL, newURL) {
        let origin = newURL.replace(document.location.hash, ""),
            old = oldURL.replace(origin, "")._clearHashbang();
        for(let route in this._routes) {
            if (!old.startsWith(route)) {
                continue;
            }
            let data = this._routes[route];
            this._leave({route: route, data: data, oldURL: oldURL, params: old.replace(route, "")._extractParams()});
            return;
        }
    }

    Router.prototype._onChange = function (e) {
        if (e && this._leave) {
            this._triggerLeave(e.oldURL, e.newURL)
            /*
            document.location.hash: "#!parameterized"
            document.location.origin: "http://127.0.0.1:8080"
            newURL: "http://127.0.0.1:8080/#!parameterized"
            oldURL: "http://127.0.0.1:8080/"

            trigger leave...
            */
        }
        for(let route in this._routes) {
            let data = this._routes[route], 
                hashData = _getHashData(route);
            if (!hashData) {
                continue;
            }
            
            /* check parameter count ... */
            
            if (data.view) {
                this._handleView(route, data, hashData)          
            } else {
                if (this._navigate) {
                    this._navigate({route: route, data: data, params: hashData.params});
                }
            }            
        }
    }

    Router.prototype.start = function () {
        var that = this;
        that._onChange.call(that);
        window.addEventListener('hashchange', (e) => {
            that._onChange.call(that, e);
        })
        return this;
    }

    return Router
 });
 