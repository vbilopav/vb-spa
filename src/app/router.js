define([], () => { 
    
    _hashData = () => {
        let elements = document.location.hash.replace(/^(#)/, "").replace(/^(!)/, "").split("/");
        if (!elements.length) {
            return
        }
        return {
            route: elements[0],
            params: elements.slice(1, elements.length)
        };
    }

    class Router  {
        constructor(options) {
            this._options = options;
            this._routes = options.routes;
            this._navigate = options.navigate;
        }
    }

    Router.prototype._onChange = function (e) {
        for(let route in this._routes) {
            let data = this._routes[route], 
                hashData = _hashData();
            if (route !== hashData.route) {
                continue;
            }
            if (data.view) {
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
 